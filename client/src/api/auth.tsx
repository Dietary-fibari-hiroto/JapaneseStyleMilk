import axiosInstance from "../utils/axiosInstance";

export type AccountType = {
  name: string;
  email: string;
  password: string;
  img_url: string;
};
export const login = async ({
  email,
  password,
}: Pick<AccountType, "email" | "password">) => {
  console.log(email, password);
  try {
    const res = await axiosInstance.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const { accessToken, account } = res.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("accountId", JSON.stringify(account.id)); // ←ここ注意！

    return res.data;
  } catch (error: any) {
    console.error("ログイン失敗:", error);
    throw error; // フロント側で catch して、エラーメッセージ出すと◎
  }
};
export const register = async (accountData: AccountType) => {
  try {
    const res = await axiosInstance.post(`/accounts`, { ...accountData });
    if (res.status === 200 || res.status === 201) {
      const data = await login({
        email: accountData.email,
        password: accountData.password,
      });
      const { accessToken, account } = data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("accountId", account.id);
    }
  } catch (error) {
    console.error("createAccountError:", error);
    throw error;
  }
};

export const checkEmail = async ({ email }: Pick<AccountType, "email">) => {
  try {
    const res = await axiosInstance.post(`/accounts/check-email`, { email });
    return res.data;
  } catch (error) {
    console.log("サーバーエラー:", error);
  }
};

export const getMe = async () => {
  const token = localStorage.getItem("token"); // ログイン時に保存したトークン

  try {
    const res = await axiosInstance.get("/accounts", {
      headers: {
        Authorization: `Bearer ${token}`, // 認証トークンをヘッダーに
      },
      withCredentials: true, // Cookieも必要な場合
    });

    localStorage.setItem("langbate_account", JSON.stringify(res.data));

    return res.data;
  } catch (error) {
    console.error("ユーザー情報取得失敗:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accountId");
  localStorage.removeItem("langbate_account");
  localStorage.removeItem("token");
};
