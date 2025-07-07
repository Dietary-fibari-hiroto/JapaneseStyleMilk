import { login } from "../../api/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormContainer, AuthInputList, FormButton } from "../../components";
import { useForm, useApiError } from "../../hooks";
import { useAccount } from "../../contexts/AccountContext";

//inputの設定
const inputConfigs = [
  {
    name: "email",
    type: "email",
    label: "メールアドレス",
    placeholder: "explain@email.com",
  },
  {
    name: "password",
    type: "password",
    label: "パスワード",
    placeholder: "password",
    rules: [
      {
        message: "8文字以上入力してください",
        validate: (value: string) => value.length >= 8,
      },
      {
        message: "大文字を1文字以上含めてください",
        validate: (value: string) => /[A-Z]/.test(value),
      },
      {
        message: "記号（!, @, #, $ など）を含めてください",
        validate: (value: string) => /[!@#$]/.test(value),
      },
    ],
  },
];
const Login = () => {
  const navigate = useNavigate();
  const { setLoginState } = useAccount();
  const { formData, handleChange, applyToFormData } = useForm(inputConfigs);
  //ページ内で使用する状態管理
  const { errorMessage, handleApiError } = useApiError(); //エラーメッセージ
  const [isFormValid, setIsFormValid] = useState(false); //フォームの制約管理
  const [isConnecting, setIsConnecting] = useState(false); //Api接続状態管理

  //ログイン処理
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsConnecting(true);
    //以下に登録等の処理を記述
    const { email, password } = formData;
    try {
      const data = await login({ email: email, password: password });
      console.log("ログイン成功:", data);
      //useAccount発火フラグ
      setLoginState(true);
      navigate("/home");
    } catch (error) {
      handleApiError(error);
      setIsConnecting(false);
    }
  };

  //inputのバリデーション制約
  useEffect(() => {
    const allValid = inputConfigs
      .filter((config) => config.rules) // rulesがあるやつだけ
      .every(({ name, rules }) => {
        const value = formData[name];
        return rules!.every((rule) => rule.validate(value));
      });

    setIsFormValid(allValid);
  }, [formData]);

  return (
    <AuthFormContainer onSubmit={handleLogin}>
      <div className="text-center flex-all-center flex-col">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          おかえりなさい！
        </p>
        <p className="text-body-r text-[--text-body]">
          また一緒に始めましょう。ログインして続けてください。
        </p>
        <p className="text-[#FF0000] break-words">{errorMessage}</p>
      </div>
      <AuthInputList
        inputConfigs={inputConfigs}
        formData={formData}
        onChange={handleChange}
        applyToFormData={applyToFormData}
      />{" "}
      <div className="flex items-justify-start w-full translate-y-[-200%] text-body-s text-[--text-link]">
        パスワードを忘れた方はこちら
      </div>
      <div className="w-full space-y-[20px] flex-all-center flex-col">
        <FormButton isValid={isFormValid} isConnecting={isConnecting} />
        <p>
          まだアカウントをお持ちでない方は、
          <Link className="text-[--text-link] font-bold" to="/register">
            こちらからどうぞ
          </Link>
        </p>
      </div>
    </AuthFormContainer>
  );
};

export default Login;
