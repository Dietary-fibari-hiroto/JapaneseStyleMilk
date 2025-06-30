import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

//ユーザー情報の型
type User = {
  id: string;
  name: string;
  img_url: string;
  email?: string;
};
//実際に保持するユーザー情報の型
interface AccountContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  accountId: string | undefined;
  setAccountId: (id: string | undefined) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const id = localStorage.getItem("accountId");
    if (id) setAccountId(id);
    console.log("context:", id);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  return (
    <AccountContext.Provider value={{ user, setUser, accountId, setAccountId }}>
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
