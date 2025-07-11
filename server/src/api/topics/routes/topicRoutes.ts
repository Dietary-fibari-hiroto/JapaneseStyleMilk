import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { TopicController } from '../controllers/topicController';
import { TopicService } from '../services/topicService';

const router = Router();
const topicService = new TopicService();
const topicController = new TopicController(topicService);

// 非同期ハンドラーをラップする関数
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// GET /topics/random - ランダムにトピックを1件取得
router.get('/random', asyncHandler(async (req, res) => {
  await topicController.getRandomTopic(req, res);
}));

// GET /topics - 全てのトピックを取得(有効なもののみ)
router.get('/', asyncHandler(async (req, res) => {
  await topicController.getAllTopics(req, res);
}));


export default router; 