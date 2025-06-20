import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// リクエストオブジェクトにユーザー情報を追加するための型拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'トークンが無効です' });
    }

    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };

    // リクエストオブジェクトにユーザー情報を追加
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '無効なトークンです' });
  }
}; 