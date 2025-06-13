import { Request, Response } from 'express';
import { AccountService } from '../services/accountService';
import { CreateAccountDTO } from '../models/account';

export class AccountController {
  constructor(private accountService: AccountService) {}

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
} 