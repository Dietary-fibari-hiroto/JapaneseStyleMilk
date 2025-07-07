import { checkEmail } from "../../api/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useApiError } from "../../hooks";
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
  const { errorMessage, handleApiError, handleCustomMessage } = useApiError();
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const exists = await checkEmail({ email: formData.email });

      if (exists.exists) {
        handleCustomMessage("このメールアドレスは既に使われています。");
        setIsConnecting(false);
        return;
      }
      navigate("/register/form", { state: formData });
    } catch (error) {
      handleApiError(error);
    }
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
      <p className="text-[#FF0000] break-words w-[373px]">{errorMessage}</p>

      <div className="space-y-[32px]">
        <AuthInputList
          inputConfigs={inputConfigs}
          formData={formData}
          onChange={handleChange}
          applyToFormData={applyToFormData}
        />
        <div className="space-y-[12px] flex-all-center flex-col">
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
