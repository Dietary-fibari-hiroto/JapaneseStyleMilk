import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthFormContainer, AuthInputList, FormButton } from "../../components";
import { useForm, useApiError } from "../../hooks";

const inputConfigs = [
  {
    name: "accountName",
    type: "text",
    label: "名前",
    placeholder: "竹中半兵衛",
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
  {
    name: "birthday",
    type: "birthday",
    label: "生年月日",
  },
];

const RegisterForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [agreedWithoutClick, setAgreedWithoutClick] = useState(false);
  const { formData, handleChange, applyToFormData } = useForm(inputConfigs);

  //registerpageで検証したemailをformDataに格納
  const email = location.state.email;
  useEffect(() => {
    if (email) {
      applyToFormData("email", email);
    }
  }, [email]);

  //登録処理
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //同意していない場合はsubmitをはじく
    if (!isAgree) {
      setAgreedWithoutClick(true);
      return;
    }
    //以下に登録等の処理を記述
    navigate("/register/selectavatar", { state: formData });
  };

  //バリデート管理
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
          プロフィールの完成まであと少し
        </p>
        <p className="text-body-r text-[--text-body]">
          必要な情報を入力して、登録を完了させましょう。
        </p>
      </div>
      <AuthInputList
        inputConfigs={inputConfigs}
        formData={formData}
        onChange={handleChange}
        applyToFormData={applyToFormData}
      />
      <div className="w-full flex-all-center flex-col space-y-[20px]">
        <div className="flex-all-center space-x-[10px]">
          <button
            type="button"
            onClick={() => {
              setIsAgree((prev) => !prev);
            }}
            className={`size-[20px] rounded-[3px] flex-all-center ${
              isAgree
                ? "bg-[--surface-check_box_checked]"
                : agreedWithoutClick
                ? "border border-[--border-error]"
                : "border border-[--default]"
            }`}
          >
            {isAgree && (
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 1.5L5.16667 8.5L1.5 5"
                  stroke="#FAFAFA"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
          </button>
          <div className="flex-all-center">
            <Link
              className="text-[--text-link] text-body-r font-font-medium"
              to=""
            >
              LANGBATEの利用規約
            </Link>
            <p>に同意します</p>
          </div>
        </div>
        <FormButton isValid={isFormValid} />
      </div>
    </AuthFormContainer>
  );
};

export default RegisterForm;
