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

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();
        setAccount(data);
      } catch (error) {
        console.log("getMe失敗", error);
        setAccount(null);
      }
    };
    fetchMe();
    console.log("fetchMe実行完了");
    setLoginState(false);
  }, [loginState]);

  return (
    <AccountContext.Provider
      value={{ account, setAccount, loginState, setLoginState }}
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
