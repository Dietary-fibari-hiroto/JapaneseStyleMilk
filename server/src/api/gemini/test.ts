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
    const { contents } = req.body;
    const generatedText =  await main(contents);

    res.json({ text: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI処理でエラーが発生しました' });
  }
});


// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});



async function run() {
  console.log("実行開始:")
  const reply = await main("こんにちは、AIって何？");
  console.log(reply);
}

run();
