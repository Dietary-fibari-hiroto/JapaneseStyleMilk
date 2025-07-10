import { Request, Response } from 'express';
import { AccountService } from '../services/accountService';
import { CreateAccountDTO } from '../models/account';
import Account from '../models/account';

export class AccountController {
  constructor(private accountService: AccountService) { }

  async createAccount(req: Request, res: Response) {
    try {
      const accountData: CreateAccountDTO = req.body;

      // メールアドレスの重複チェック
      const existingAccount = await this.accountService.findByEmail(accountData.email);
      if (existingAccount) {
        return res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
      }

      const account = await this.accountService.createAccount(accountData);
      res.status(201).json(account);
      console.log('アカウントが作成されました');
    } catch (error) {
      console.error('アカウント作成エラー:', error);
      res.status(500).json({ error: 'アカウントの作成に失敗しました' });
    }
  }
  async editAccount(req: Request, res: Response) {
    try {
      const accountData: CreateAccountDTO = req.body;
      const account = await this.accountService.editAccount(accountData);
      res.status(200).json(account);
    } catch (error) {
      console.error('アカウント編集エラー:', error);
      res.status(500).json({ error: 'アカウントの編集に失敗しました' });
    }
  }

  async getTotalEvaluation(req: Request, res: Response) {
    try {
      const accountId = Number(req.params.id);

      if (!accountId) {
        return res.status(400).json({ error: 'アカウントIDが必要です' });
      }

      const totalEvaluation = await this.accountService.getTotalEvaluation(accountId);

      if (!totalEvaluation) {
        return res.status(404).json({ error: '総合評価が見つかりません' });
      }

      res.json({
        account_id: totalEvaluation.account_id,
        total_score: totalEvaluation.total_score,
        advice: totalEvaluation.advice,
        winning_streak: totalEvaluation.winning_streak,
        wins: totalEvaluation.wins,
        loses: totalEvaluation.loses,
      });
    } catch (error) {
      console.error('総合評価取得エラー:', error);
      res.status(500).json({ error: '総合評価の取得に失敗しました' });
    }
  }

  //jsw tokenからユーザー情報を取得
  async getMe(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '認証情報がありません' });
    }
    try {
      const user = await Account.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'サーバーエラー' });
    }
  }

  // 主キーからユーザー情報を取得(paramsで指定)
  async getAccountInfo(req: Request, res: Response) {
    const accountId = Number(req.params.id);
    if (!accountId) {
      return res.status(400).json({ message: 'アカウントIDが必要です' });
    }
    try {
      const account = await this.accountService.getAccInfo(accountId);
      res.json(account);
    } catch (err) {
      res.status(500).json({ message: 'サーバーエラー' });
    }
  }
}

export const getMe = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: '認証情報がありません' });
  }
  try {
    const user = await Account.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'emailは必須です' });
  }
  try {
    const user = await Account.findOne({ where: { email } });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
};