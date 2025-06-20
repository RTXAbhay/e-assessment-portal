// backend/utils/openaiClient.js
import { config } from "dotenv";
config();   // just in case somebody imports this directly
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
