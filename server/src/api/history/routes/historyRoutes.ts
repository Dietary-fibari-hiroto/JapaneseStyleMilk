import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { HistoryController } from '../controllers/historyController';
import { HistoryService } from '../services/historyService';
import { authMiddleware } from '../../auth/middlewares/authMiddleware';

const router = Router();
const historyService = new HistoryService();
const historyController = new HistoryController(historyService);

// 非同期ハンドラー
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// GET /history (認証が必要)
router.get('/', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.getUserDebateHistories(req, res);
}) as RequestHandler);

// GET /history/win-loss-stats (認証が必要)
router.get('/win-loss-stats', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.getWinLossStats(req, res);
}) as RequestHandler);

// GET /history/:debate_history_id/evaluations (認証が必要)
router.get('/:debate_history_id/evaluations', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.getEvaluations(req, res);
}) as RequestHandler);

// GET /history/:id (認証が必要)
router.get('/:id', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.getDebateDetail(req, res);
}) as RequestHandler);

// POST /history (認証が必要)
router.post('/', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.createDebateHistory(req, res);
}) as RequestHandler);

// POST /history/:debate_history_id/evaluations (認証が必要)
router.post('/:debate_history_id/evaluations', authMiddleware as RequestHandler, asyncHandler(async (req, res) => {
  await historyController.createEvaluations(req, res);
}) as RequestHandler);

export default router; 