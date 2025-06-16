import { Router, RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// 認証不要のルート
router.post('/login', authController.login as RequestHandler);
router.post('/refresh-token', authController.refreshToken as RequestHandler);

// 認証が必要なルート
router.post('/logout', authMiddleware as RequestHandler, authController.logout as RequestHandler);

export default router; 