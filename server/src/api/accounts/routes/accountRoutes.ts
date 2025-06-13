import { Router, Request, Response, NextFunction } from 'express';
import { AccountController } from '../controllers/accountController';
import { AccountService } from '../services/accountService';

const router = Router();
const accountService = new AccountService();
const accountController = new AccountController(accountService);

// 非同期ハンドラーをラップする関数
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', asyncHandler(async (req, res) => {
  await accountController.createAccount(req, res);
}));

export default router; 