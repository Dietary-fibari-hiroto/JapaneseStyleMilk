// import axios from "axios";
// import FormData from "form-data";
// import fs from "fs";

// export class LocalWhisperClient {
//   private accumulatedText = "";

//   // 毎回 transcribe して、全文を返す
//   async transcribe(filePath: string): Promise<string> {
//     const form = new FormData();
//     form.append("file", fs.createReadStream(filePath));

//     const response = await axios.post("http://localhost:5000/transcribe", form, {
//       headers: form.getHeaders(),
//     });

//     const newText = response.data.text;

//     // 前回までのテキストに今回のテキストを追加
//     this.accumulatedText += (this.accumulatedText ? " " : "") + newText;

//     // 全文を返す
//     return this.accumulatedText;
//   }

//   // リセット（必要なら）
//   reset(): void {
//     this.accumulatedText = "";
//   }
// }
