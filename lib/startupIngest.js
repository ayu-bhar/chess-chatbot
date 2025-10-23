import { getEmbedding } from "../lib/embeddings.js";
import { index } from "../lib/pineconeClient.js";
import { chunkText } from "../utils/chunking.js";
import * as cheerio from "cheerio";

/**
 * Fetches and cleans page text from a given URL.
 */
async function fetchPageText(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

/**
 * Pushes content from a set of URLs into Pinecone automatically.
 */
export async function initializePineconeIndex() {
  const links = [
    // "https://en.wikipedia.org/wiki/Sicilian_Defence",
    // "https://en.wikipedia.org/wiki/Chess_opening",
    // "https://www.chess.com/lessons/openings",
    // "https://en.wikipedia.org/wiki/Chess_tactic",
    // "https://en.wikipedia.org/wiki/List_of_World_Chess_Championships",
    // "https://www.chess.com/terms",
    // "https://en.wikipedia.org/wiki/Chess_middlegame",
    // "https://en.wikipedia.org/wiki/World_Chess_Championship",
    // "https://en.wikipedia.org/wiki/Chess_endgame",
    // "https://en.wikipedia.org/wiki/List_of_chess_openings",
    // "https://chesspathways.com/chess-openings/",
    // "https://en.wikipedia.org/wiki/London_System",
    // "https://en.wikipedia.org/wiki/Dutch_Defence",
    // "https://en.wikipedia.org/wiki/Chess_theory",
    // "https://www.chess.com/article/view/opening-theory",
    // "https://www.chessable.com/blog/beginner-opening-theory/",
    // "https://chessfox.com/chess-openings-list/",
    // "https://en.wikibooks.org/wiki/Chess_Opening_Theory",
    // "https://www.chess.com/article/view/history-of-chess",
    // "https://en.wikipedia.org/wiki/Chess",
    // "https://www.chess.com/terms/chess-middlegame",
    // "https://thechessworld.com/articles/middle-game/7-most-important-middlegame-principles/?srsltid=AfmBOor47MbOxOMW83mwsxmb-iGQQoEJXPyl5GSG45c7M47AlBsE-xjE"
  ];

  console.log("Starting automatic ingestion for predefined links...");

  for (const link of links) {
    try {
      console.log(`Fetching content from ${link}`);
      const text = await fetchPageText(link);
      const chunks = chunkText(text, 1000);

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

      console.log(`✅ Successfully ingested ${chunks.length} chunks from: ${link}`);
    } catch (err) {
      console.error(`❌ Error processing ${link}:`, err.message);
    }
  }

  console.log("🏁 Automatic Pinecone ingestion complete.");
}
