// server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import accountRoutes from "./src/api/accounts/routes/accountRoutes";
import authRoutes from "./src/api/auth/routes/authRoutes";
import historyRoutes from "./src/api/history/routes/historyRoutes";
import logger from "./src/middlewares/logger";

import path from "path";

const app = express();
const port = process.env.PORT || 3000;

// グローバルミドルウェアの設定
app.use(
  cors({
    origin: "http://localhost:3000", // フロントのURLを明示！
    credentials: true, // 認証情報（cookie等）を許可
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ルートの設定
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// エラーハンドリング
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});
