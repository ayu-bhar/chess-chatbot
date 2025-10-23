import { NextResponse } from "next/server";
import { streamAnswer } from "../../../utils/rag.js";
import { rateLimit } from "../../../lib/rateLimint.js";

export async function POST(request) {
	const { query, userId } = await request.json();

	if (!userId) {
		return NextResponse.json({ error: "UserId is required" }, { status: 400 });
	}

	if (!rateLimit(userId)) {
		return NextResponse.json(
			{ error: "Rate limit exceeded. Max 4 requests per minute." },
			{ status: 429 }
		);
	}

	// 1. Get the stream reader or an error string from the RAG utility
	const streamOrError = await streamAnswer(query);

	// Handle case where streamAnswer returned an error string
	if (typeof streamOrError === "string") {
		return NextResponse.json({ error: streamOrError }, { status: 500 });
	}

	const reader = streamOrError;
	const textEncoder = new TextEncoder();
	const decoder = new TextDecoder(); // Needed to decode the SSE chunks

	// 2. Create a custom ReadableStream to parse the SSE format and pipe the text
	const readableStream = new ReadableStream({
		async start(controller) {
			const sseDelimiter = "\n\n";
			let buffer = "";

			try {
				while (true) {
					// Use the Reader's pull-based read() method (correct usage)
					const { value, done } = await reader.read();

					if (done) {
						// Process any final content left in the buffer before closing
						if (buffer.trim().length > 0) {
							// If the buffer contains complete data chunks not ending in \n\n
							buffer.split(sseDelimiter).forEach(chunk => {
								if (chunk.trim()) {
									try {
										const json = JSON.parse(chunk.substring(5).trim()); // Strip 'data: ' prefix
										const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
										if (text) controller.enqueue(textEncoder.encode(text));
									} catch (e) {
										// console.warn("Failed to parse final chunk:", e);
									}
								}
							});
						}
						controller.close();
						return;
					}

					buffer += decoder.decode(value, { stream: true });
					let chunks = buffer.split(sseDelimiter);

					// Process all but the last chunk (which might be incomplete)
					for (let i = 0; i < chunks.length - 1; i++) {
						const sseChunk = chunks[i].trim();
						if (sseChunk.startsWith("data:")) {
							try {
								// Strip 'data: ' prefix and parse the JSON
								const json = JSON.parse(sseChunk.substring(5).trim());
								
								// Extract the text part from the Gemini response structure
								const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
								
								if (text) {
									controller.enqueue(textEncoder.encode(text));
								}
							} catch (e) {
								console.error("Error parsing SSE chunk:", e);
								// Continue to the next chunk if parsing failed
							}
						}
					}
					// Keep the potentially incomplete last chunk in the buffer for the next read
					buffer = chunks[chunks.length - 1];
				}
			} catch (error) {
				console.error("Streaming error in route handler:", error);
				controller.error(error);
			}
		},
	});

	// 3. Return the response using the newly created ReadableStream
	return new NextResponse(readableStream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			"Connection": "keep-alive",
		},
	});
}
