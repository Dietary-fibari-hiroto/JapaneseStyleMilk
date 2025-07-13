import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_SECRET_KEY,
});

export async function main(contents: string): Promise<string> {
  const ask =   contents;
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ask,
  });
  if (result.text) {
    return result.text;
  } else {
    throw new Error('AIからの応答テキストが取得できませんでした');
  }
}