import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks";
import { AuthFormContainer, FormButton, AuthInputList } from "../../components";
const inputConfigs = [
  {
    name: "email",
    type: "email",
    label: "メールアドレス",
    placeholder: "email@example.com",
    rules: [
      {
        message: "8文字以上入力してください",
        validate: (value: string) => value.length >= 8,
      },
      {
        message: "メール形式にしてください",
        validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      },
    ],
  },
];
const Register = () => {
  const navigate = useNavigate();
  const { formData, handleChange, applyToFormData } = useForm(inputConfigs);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  useEffect(() => {
    const allValid = inputConfigs.every(({ name, rules }) => {
      const value = formData[name];
      return rules.every((rule) => rule.validate(value));
    });
    setIsFormValid(allValid);
  }, [formData]);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConnecting(true);
    //テスト用のセットタイムアウト
    setTimeout(() => {
      navigate("/register/form", { state: formData });
    }, 3000);
    /**
     * ここにAPI通信などなど処理記述予定
     */
  };
  return (
    <AuthFormContainer onSubmit={handleRegister}>
      <div className="text-center ">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          LANGBATEへようこそ
        </p>
        <p className="text-body-r text-[--text-body]">
          楽しく本格的なディベートで、英語力を磨こう。
        </p>
      </div>
      <div className="space-y-[32px]">
        <AuthInputList
          inputConfigs={inputConfigs}
          formData={formData}
          onChange={handleChange}
          applyToFormData={applyToFormData}
        />
        <div className="space-y-[12px]">
          <FormButton isValid={isFormValid} isConnecting={isConnecting} />
          <div className="flex-all-center text-body-r space-x-[5px]">
            <p>すでにアカウントをお持ちですか？</p>
            <Link to="/login" className="text-[--text-link] font-bold">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </AuthFormContainer>
  );
};
export default Register;
