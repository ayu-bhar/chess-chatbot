import { NextResponse } from "next/server";
import { getEmbedding } from "../../../lib/embeddings.js";
import { index } from "../../../lib/pineconeClient.js";
import { chunkText } from "../../../utils/chunking.js";
import * as cheerio from "cheerio";

// Helper: Extract plain text from a webpage given a URL
async function fetchPageText(url) {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  $("script, style, noscript").remove(); // Clean non-content
  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim();
}

// MAIN INGEST FUNCTION
export async function POST(request) {
  const { links } = await request.json();

  if (!Array.isArray(links) || links.length === 0) {
    return NextResponse.json({ error: "Please provide an array of links." }, { status: 400 });
  }

  const inserted = [];

  for (const link of links) {
    try {
      console.log(`Fetching content from ${link}...`);
      const pageText = await fetchPageText(link);
      const chunks = chunkText(pageText, 1000);

      for (let i = 0; i < chunks.length; i++) {
        const embedding = await getEmbedding(chunks[i]);
        await index.upsert([
          {
            id: `${link}-${i}`,
            values: embedding,
            metadata: { url: link, text: chunks[i] },
          },
        ]);
      }
      inserted.push({ link, chunks: chunks.length });
    } catch (error) {
      console.error(`Error processing ${link}`, error);
    }
  }

  return NextResponse.json({
    success: true,
    message: "All URLs processed and uploaded to Pinecone.",
    inserted,
  });
}
