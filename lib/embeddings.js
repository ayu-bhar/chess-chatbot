import { geminiAPI } from "./gemini.js";

export async function getEmbedding(text) {
  // 🟢 CORRECTED: Using the standard embedding model 'text-embedding-004'
  const endpoint = `/models/text-embedding-004:embedContent`; 

  try {
    const response = await geminiAPI.post(endpoint, {
      content: {
        role: "user",
        parts: [{ text: text }]
      }
    });

    const embeddingValues = response.data.embedding.values;
    
    console.log("Received embedding of length:", embeddingValues.length);
    console.log("Embedding generation complete.");
    console.log(embeddingValues); // Log the actual embedding values
    
    return embeddingValues;

  } catch (error) {
    console.error("Error generating embedding:", error.response?.data || error.message);
    return null; 
  }
}