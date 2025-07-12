import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIWhisperClient {
  async transcribe(filePath: string): Promise<string> {
    const stream = fs.createReadStream(filePath);
    const result = await openai.audio.transcriptions.create({
      file: stream,
      model: "whisper-1",
      language: "ja", // or "en"
    });

    return result.text;
  }
}
