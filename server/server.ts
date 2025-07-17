// server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import accountRoutes from "./src/api/accounts/routes/accountRoutes";
import authRoutes from "./src/api/auth/routes/authRoutes";
import historyRoutes from "./src/api/history/routes/historyRoutes";
import topicRoutes from "./src/api/topics/routes/topicRoutes";
import evaluationRoutes from "./src/api/evaluation/routes/evaluationRoutes";
import logger from "./src/middlewares/logger";
import uploadRouter from "./src/api/accounts/routes/uploadRoutes";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import setupSocket from "./src/api/realtimeapi/call/routes";
import { transcribe, uploadMiddleware } from "./src/api/whisperapi//TranscriptionController";
const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


setupSocket(io);

// グローバルミドルウェアの設定
app.use(
  cors({
    origin: "http://localhost:3000", // フロントの起動と合わせる。（開発用ですべて許可）
    credentials: true, // 認証情報（cookie等）を許可
  })
);

app.use(express.json()); // 自動でjsonをオブジェクトにしてくれるよーー
app.use(express.urlencoded({ extended: true }));
app.use(logger);
//静的ファイル公開
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ルートの設定
app.use("/api/upload", uploadRouter);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.post("/api/transcribe", uploadMiddleware, transcribe);

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

// HTTP test endpoint
app.get("/socket", (req, res) => {
  res.send("WebRTC + Socket.IO server is running");
});

// サーバー起動
server.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});
