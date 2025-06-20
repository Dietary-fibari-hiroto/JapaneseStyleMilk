// server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import accountRoutes from './src/api/accounts/routes/accountRoutes';
import authRoutes from './src/api/auth/routes/authRoutes';

const app = express();
const port = process.env.PORT || 3000;

// グローバルミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});