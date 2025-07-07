import OpenAI from "openai";
import dotenv from "dotenv";

const apikey=process.env.API_KEY;

const openai = new OpenAI();//初期化

async function transcribeAudio(audioFilePath: string) {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1", // モデル設定
            // response_format: "verbose_json", // 返し方
            temperature: 0.8, // 精度
            language: "en", // 言語の設定、一旦英語
        });
        console.log("Transcription:", transcription.text);
    } catch (error) {
        console.error("Error transcribing audio:", error);
    }
}