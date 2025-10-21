import { getEmbedding } from "../lib/embeddings.js";
import { index } from "../lib/pineconeClient.js";
import { geminiAPI } from "../lib/gemini.js";
// import { contents } from "cheerio/dist/commonjs/api/traversing.js";

export async function getAnswer(query) {
  // Generate embedding for the query
  const embedding = await getEmbedding(query);
  console.log("Query Embedding:", embedding);

  // Retrieve relevant docs from Pinecone
  const results = await index.query({
    vector: embedding, topK: 5, includeMetadata: true
  });

  console.log("Pinecone Query Results:", results);
  // Concatenate the text from the top 5 relevant documents to form the context
  const context = results.matches.map(m => m.metadata.text).join("\n\n");

  // Use Gemini to generate response combining retrieved context and user query

  const prompt = `You are "ChessMate", an AI chess expert assistant , do not greet every time give general responses. Using the context below, answer the question:\n\nContext:\n${context}\n\nQuestion:\n${query}`;

  // --- CONVERTED PAYLOAD STRUCTURE ---
  // The Gemini API expects an array under the 'contents' key.
  const payload = {
    contents: [
      {
        // Define the parts for the user's turn
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    // RAG queries often benefit from a lower temperature for more factual, grounded responses
    generationConfig: {
      temperature: 0.2
    }
  };

  // Using the recommended model name for the API endpoint
  const response = await geminiAPI.post('/models/gemini-2.5-flash-preview-09-2025:generateContent', payload);

  console.log("Gemini Response:", response.data);
  // The response data extraction remains correct for the standard API response structure
  return response.data.candidates[0].content.parts[0].text;
}
