// src/middleware/logger.ts
import morgan, { StreamOptions } from "morgan";

// オプション: カスタムストリーム設定（例：console に出力）
const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

// morgan ミドルウェア本体
const logger = morgan("dev", { stream });

export default logger;
