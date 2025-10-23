import { getEmbedding } from "../lib/embeddings.js";
import { index } from "../lib/pineconeClient.js";
// Removed GoogleGenerativeAI import to use standard fetch
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

// Define the model and API key securely
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RAG_RETRIES = 3; 

/**
 * Retrieves RAG context, initiates a streaming call to Gemini, and returns a stream reader.
 * @param {string} query The user's question.
 * @returns {Promise<ReadableStreamDefaultReader | string>} The stream reader for the response, or an error message string.
 */
export async function streamAnswer(query) {
  // --- 1. RAG Context Retrieval with Retry Logic ---
  let context = "";
  for (let attempt = 0; attempt < MAX_RAG_RETRIES; attempt++) {
    try {
      // Generate embedding for the query
      const embedding = await getEmbedding(query);
      
      // Retrieve relevant docs from Pinecone
      const results = await index.query({
        vector: embedding, topK: 5, includeMetadata: true
      });
      
      context = results.matches.map(m => m.metadata.text).join("\n\n");
      break; // Success
    } catch (ragError) {
      console.warn(`RAG retrieval attempt ${attempt + 1} failed. Retrying...`);
      if (attempt === MAX_RAG_RETRIES - 1) {
        console.error("Final RAG context retrieval failed after all retries.");
        context = "Knowledge retrieval failed. Answering based on general knowledge.";
      } else {
        const waitTime = Math.pow(2, attempt) * 500 + Math.random() * 500;
        await delay(waitTime);
      }
    }
  }

  // --- 2. Prepare Streaming Payload ---
  const prompt = `You are "ChessMate", an AI chess expert assistant, do not greet every time until the user greets , give general responses. Using the context below, answer the question:\n\nContext:\n${context}\n\nQuestion:\n${query}`;

  const streamingPayload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2
    }
  };

  // --- 3. Initiate Streaming API Call and Return Reader ---
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    // Use '?alt=sse' for Server-Sent Events streaming format
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}&alt=sse`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(streamingPayload)
    });

    if (!response.ok || !response.body) {
      const errorText = `Gemini API error ${response.status}: ${await response.text()}`;
      console.error(errorText);
      return "Failed to connect to the AI model due to an API error.";
    }

    // Return the reader from the response body for the API route to consume
    return response.body.getReader();

  } catch (error) {
    console.error("Error during streaming initiation:", error);
    return "Failed to connect to the AI model.";
  }
}
