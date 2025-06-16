import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'メールアドレスとパスワードは必須です' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
      }
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'リフレッシュトークンは必須です' });
      }

      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
      }
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const result = await authService.logout();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  },
}; 