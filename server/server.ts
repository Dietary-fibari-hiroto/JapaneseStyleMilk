// server.ts
import express from 'express';

const app = express();

// ミドルウェアの設定
app.use(express.json());

// サーバー起動
app.listen(3000, () => {
  console.log('サーバー起動');
});