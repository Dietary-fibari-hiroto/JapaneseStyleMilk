// import { Request, Response } from "express";
// import multer from "multer";
// import fs from "fs";
// import { TranscribeAudioUseCase } from "./TranscribeAudioUseCase";
// import {gemini} from "../gemini/geminiApi"

// const upload = multer({ dest: "uploads/" });

// const useCase = new TranscribeAudioUseCase();

// export const uploadMiddleware = upload.single("audio");


// export const transcribe = async (req: Request, res: Response): Promise<void> => {
//   if (!req.file) {
//     res.status(400).json({ error: "音声ファイルが必要です" });
//     return;
//   }

//   const filePath = req.file.path;

//   try {
//     const text = await useCase.execute(filePath);
//     fs.unlinkSync(filePath);
    
//     gemini(text);
//     res.json({ text });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "文字起こしに失敗しました" });
//   }
// };
