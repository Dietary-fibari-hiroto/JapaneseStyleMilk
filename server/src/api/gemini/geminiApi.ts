import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

export async function main(contents: string): Promise<void> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,  // ここを引数を使うように変更
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  console.log(response.text);
}
