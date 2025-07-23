import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

export class GeminiClient {
  private ai: GoogleGenAI;

  // インスタンス化の時apiKeyわたしてね
  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async ask(content: string): Promise<string> {
    const result = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });

    if (result.text) {
      return result.text;
    } else {
      throw new Error('AIからの応答が得られませんでした');
    }
  }
}