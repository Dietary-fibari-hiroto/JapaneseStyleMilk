import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { main } from './geminiApi';  // AI処理があるファイル

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST /api/generate でAIにテキスト生成をリクエスト
app.post('/api/generate', async (req, res) => {
  try {
    // 例えばリクエストボディに { contents: "説明して" } を期待する場合
    const { contents } = req.body;

    // main関数をAIの呼び出しとして修正して返り値を受け取る設計にすると良いです
    // 例）main関数は生成テキストを返すようにしておく（Promise<string>）
    const generatedText = await main(contents);

    res.json({ text: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI処理でエラーが発生しました' });
  }
});

async function test() {
  console.log('test開始');
  const result = await main("AIの仕組みについて教えて");
  console.log('AIからの応答:', result);
}

test();

// エラーハンドリング（既存）
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});
