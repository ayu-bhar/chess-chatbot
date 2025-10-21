import { NextResponse } from "next/server";
import { index } from "../../../lib/pineconeClient.js";

export async function POST(request) {
  const { embedding, topK = 5 } = await request.json();

  // Query vector DB and return matched documents
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return NextResponse.json(results.matches.map(m => m.metadata.text));
}
