import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { EvaluationController } from '../controllers/evaluationController';
import { EvaluationService } from '../services/evaluationService';

const router = Router();
const evaluationService = new EvaluationService();
const evaluationController = new EvaluationController(evaluationService);

// 非同期ハンドラーをラップする関数
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// POST /evaluation/evaluate - ディベート内容を評価する
router.post('/evaluate', asyncHandler(async (req, res) => {
  await evaluationController.evaluateDebate(req, res);
}));

// GET /evaluation/:debateHistoryId - ディベート履歴IDから評価結果を取得
router.get('/:debateHistoryId', asyncHandler(async (req, res) => {
  await evaluationController.getEvaluationByDebateHistoryId(req, res);
}));

export default router; 