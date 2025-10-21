import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


import { Pinecone } from "@pinecone-database/pinecone";
// console.log("--------here i am -------------");
// console.log("Pinecone API Key:", process.env.PINECONE_API_KEY); // Debug line to verify env variable
// console.log("Gemini API Key:", process.env.GEMINI_API_KEY); // Debug line to verify env variable
const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

export const index = client.Index("chessmate-index");
