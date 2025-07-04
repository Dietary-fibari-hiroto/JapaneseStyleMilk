import { Account } from "../../types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormContainer, FormButton } from "../../components";
import Avatar from "../../components/common/Avatar";
import { getMe } from "../../api/auth";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account>({
    id: 0,
    name: "",
    email: "",
    img_url: "",
  });
  useEffect(() => {
    const get = async () => {
      const accountData = await getMe();
      setAccount(accountData);
    };
    get();
  }, []);
  useEffect(() => {
    console.log(account);
  }, [account]);
  const handleStart = () => {
    navigate("/home");
  };
  return (
    <AuthFormContainer onSubmit={handleStart}>
      <div className="text-center ">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          {account.name}。ようこそLangbateへ
        </p>
        <p className="text-body-r text-[--text-body]">
          あなたのことばが、ここからつながる
        </p>
      </div>
      <div>
        <Avatar image={account.img_url} size="xl" />
      </div>

      <div className="w-full space-y-[20px] flex-all-center flex-col">
        <FormButton label="ホーム画面へ" />
      </div>
    </AuthFormContainer>
  );
};

export default WelcomePage;
