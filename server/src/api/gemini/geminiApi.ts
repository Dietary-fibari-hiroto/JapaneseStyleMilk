import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';


const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
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

//クライアントからの送信例↓
//portの変化に注意
// fetch("http://localhost:3300/api/generate", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ contents: "AIについて説明して" })
// })
//   .then(res => res.json())
//   .then(data => console.log(data.text));

//エントリーポイントからの操作
// async function run() {
//   console.log("実行開始:")
//   const reply = await main("こんにちは、AIって何？");
//   console.log(reply);
// }
// run();
