import { CreateAccountDTO } from '../models/account';
import Account from '../models/account';
import AccountState from '../models/accountState';
import Rank from '../models/rank';
import TotalEvaluation from '../models/totalEvaluation';
import bcrypt from 'bcrypt';

export class AccountService {
  async createAccount(accountData: CreateAccountDTO) {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(accountData.password, 10);

    // トランザクションの開始
    const result = await Account.sequelize!.transaction(async (t) => {
      // アカウントの作成
      const account = await Account.create(
        {
          ...accountData,
          password: hashedPassword,
        },
        { transaction: t }
      );

      // デフォルトのランクを取得または作成
      let defaultRank = await Rank.findOne({
        where: { level: 1 },
        transaction: t
      });

      if (!defaultRank) {
        // ランクが存在しない場合は作成(ここら辺はあまり決まってないから後日またかわるかも泣)
        defaultRank = await Rank.create(
          {
            name: '初心者',
            level: 1
          },
          { transaction: t }
        );
      }

      // アカウントステータスの作成
      await AccountState.create(
        {
          account_id: account.id,
          rank_id: defaultRank.id,
        },
        { transaction: t }
      );

      return account;
    });

    return result;
  }

  async findByEmail(email: string) {
    return Account.findOne({ where: { email } });
  }

  async editAccount(accountData: CreateAccountDTO) {
    const hashedPassword = await bcrypt.hash(accountData.password, 10);
    return Account.update(
      {
        ...accountData,
        password: hashedPassword,
      },
      { where: { id: accountData.id } }
    );
  }

  async getTotalEvaluation(accountId: number) {
    return TotalEvaluation.findOne({
      where: { account_id: accountId }
    });
  }

  async getAccInfo(accountId: number) {
    return Account.findOne({
      where: { id: accountId },
      attributes: { exclude: ['password', 'email'] }
    })
  }

  async checkEmailExists(email: string) {
    const user = await Account.findOne({ where: { email } });
    // 可読性上げたいから!! → Boolean()にした
    return Boolean(user);
  }
}