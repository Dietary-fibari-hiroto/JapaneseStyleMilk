import Account from "../../accounts/models/account";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthService {
  async login(email: string, password: string) {
    // アカウントの検索
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      throw new Error("アカウントが見つかりません");
    }

    // パスワードの検証
    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) {
      throw new Error("パスワードが正しくありません");
    }
    //テスト用のコンソール
    console.log("ここで処理が止まる");
    // JWTトークンの生成
    const accessToken = jwt.sign(
      { id: account.id, email: account.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // リフレッシュトークンの生成
    const refreshToken = jwt.sign(
      { id: account.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken,
      account: {
        id: account.id,
        email: account.email,
        name: account.name,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    // リフレッシュトークンの検証
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: number };

    // アカウント情報の取得
    const account = await Account.findByPk(decoded.id);
    if (!account) {
      throw new Error("アカウントが見つかりません");
    }

    // 新しいアクセストークンの生成
    const newAccessToken = jwt.sign(
      { id: account.id, email: account.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return {
      accessToken: newAccessToken,
      account: {
        id: account.id,
        email: account.email,
        name: account.name,
      },
    };
  }

  async logout() {
    // クライアント側でトークンを破棄するから、サーバーではなにもしないよーーーーーーーーーーーーーーーーーーーーー
    return { message: "ログアウトしました" };
  }
}
