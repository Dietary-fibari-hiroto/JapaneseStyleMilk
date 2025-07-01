import axiosInstance from "../utils/axiosInstance";

type AccountType = {
  name: string;
  email: string;
  password: string;
  img_url?: string;
};

export const login = async ({
  email,
  password,
}: Pick<AccountType, "email" | "password">) => {
  const res = await axiosInstance.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );
  const { token, account } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("account", account);
  console.log("ログイン成功", account);
  return res.data;
};

export const register = async (accountData: AccountType) => {
  try {
    const res = await axiosInstance.post(`/accounts`, { ...accountData });
    if (res.status === 200 || res.status === 201) {
      const data = await login({
        email: accountData.email,
        password: accountData.password,
      });
      const { token, account } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("account", account);
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
