import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AuthFormContainer,
  AuthInputList,
  CheckBox,
  FormButton,
} from "../../components";
import { useForm } from "../../hooks";

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { formData, handleChange, applyToFormData } = useForm(inputConfigs);
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //同意していない場合はsubmitをはじく

    setIsConnecting(true);
    //テスト用のセットタイムアウト
    setTimeout(() => {}, 3000);
    //以下に登録等の処理を記述
  };
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
    <AuthFormContainer onSubmit={handleRegister}>
      <div className="text-center ">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          おかえりなさい！
        </p>
        <p className="text-body-r text-[--text-body]">
          また一緒に始めましょう。ログインして続けてください。
        </p>
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
      <div className="w-full space-y-[20px]">
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
