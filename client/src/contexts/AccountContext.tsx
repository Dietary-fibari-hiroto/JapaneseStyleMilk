import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getMe } from "../api/auth";
import { Account } from "../types";
//ユーザー情報の型

//実際に保持するユーザー情報の型
interface AccountContextType {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  loginState: boolean;
  setLoginState: (loginState: boolean) => void;
  isFetching: boolean;
  setIsFetching: (loginState: boolean) => void;
}
//Contextの初期化(undefinedを許容し、カスタムフックで扱う)
export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

//Providerコンポーネントの型定義
interface AccountProviderProps {
  children: ReactNode;
}

const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null); //アカウントの情報そのものを保持
  const [loginState, setLoginState] = useState(false); //ログインの発火を管理
  const [isFetching, setIsFetching] = useState(true);
  //初回レンダリング処理
  useEffect(() => {
    const stored = localStorage.getItem("langbate_account");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAccount(parsed);
      } catch (error) {
        console.log(
          "アカウント情報の復元に失敗。ログインしてください。",
          error
        );
      } finally {
        setIsFetching(false);
      }
    }
  }, []);

  //ステートが意図的に変わったときに実行される処理。
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMe = async () => {
      try {
        if (!token) return;
        const data = await getMe();
        setAccount(data);
      } catch (error) {
        setAccount(null);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMe();
    setLoginState(false);
  }, [loginState]);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        loginState,
        setLoginState,
        isFetching,
        setIsFetching,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("コンテキストの値がプロバイダー外で呼び出されてるわ");
  }
  return context;
};

export default AccountProvider;
