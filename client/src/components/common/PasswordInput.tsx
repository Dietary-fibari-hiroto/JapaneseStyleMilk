import { ChangeEvent, useState } from "react";
import { RequirementBullet } from "../";
// 入力制約の型付け
type ValidationRule = {
  message: string;
  validate: (value: string) => boolean;
};

type PasswordInputProps = {
  name: string;
  value: string;
  label: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  rules?: ValidationRule[];
  showError?: boolean;
};

const PasswordInputBox = ({
  name,
  value,
  label,
  placeholder,
  onChange,
  rules = [],
  showError = false,
}: PasswordInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      <div className="relative">
        <input
          className={inputClass}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)} //フォーカス時
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 text-sm"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

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

export default PasswordInputBox;
