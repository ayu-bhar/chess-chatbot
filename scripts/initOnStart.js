import { initializePineconeIndex } from "../lib/startupIngest.js";

(async function runStartupTasks() {
  try {
    console.log("🟡 Initializing ChessMate Vector Index...");
    await initializePineconeIndex();
    console.log("✅ Pinecone vector database is ready.");
  } catch (error) {
    console.error("❌ Failed during startup ingestion:", error);
  }
})();
