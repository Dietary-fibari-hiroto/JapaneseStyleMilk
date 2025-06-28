import { useState } from "react";
import { ChangeEvent } from "react";
import { RequirementBullet } from "../";

/**
 * フロント const inputCategoryオブジェクト定義例
 * const inputCategory = [
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
 */

//入力制約の型付け
type ValidationRole = {
  message: string;
  validate: (value: string) => boolean;
};
type InputConponentProps = {
  type: string;
  name: string;
  value: string;
  label: string;
  placeholder?: string | "";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  rules?: ValidationRole[];
  showError?: boolean;
};

const InputBox = ({
  type,
  name,
  value,
  label,
  placeholder,
  onChange,
  rules = [],
  showError = false,
}: InputConponentProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = rules.some((rule) => !rule.validate(value));
  const allPassed =
    rules.length > 0 && rules.every((rule) => rule.validate(value));
  const inputClass = `
  outline-none border w-full h-[48px] rounded-[6px] pl-[10px]
  ${
    showError
      ? hasError
        ? "border-red-500"
        : allPassed
        ? "border-[--border-success]"
        : "border-[--border-input_box]"
      : "border-[--border-input_box] focus:border-[2px]"
  }
  `;
  return (
    <div className="w-[373px] min-h-[86px] space-y-[5px]">
      <p className="text-header-s font-medium">{label}</p>
      <input
        className={inputClass}
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onFocus={() => setIsFocused(true)} //フォーカス時
        required
      />
      {isFocused && (
        <ul className="flex flex-col items-start justify-start text-xs mt-1">
          {rules.map((rule, idx) => {
            const passed = rule.validate(value);
            return (
              <li
                key={idx}
                className={`flex items-center justify-start space-x-[4px] ${
                  passed ? "text-[--text-success]" : "text-gray-500"
                }`}
              >
                <RequirementBullet mode={passed} /> <p>{rule.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InputBox;
