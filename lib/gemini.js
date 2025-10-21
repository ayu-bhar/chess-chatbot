import axios from "axios";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const geminiAPI = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  params: { key: process.env.GEMINI_API_KEY },
});
