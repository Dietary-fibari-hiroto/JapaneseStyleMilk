import { Request, Response } from "express";

export const uploadImageController = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: "ファイルがアップロードされていません" });
    return;
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
};
