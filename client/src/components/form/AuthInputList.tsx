import { InputBox, BirthdayInput, PasswordInput } from "../";
import { ChangeEvent } from "react";
type ValidationRole = {
  message: string;
  validate: (value: string) => boolean;
};

type ChangeHandler = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;
// 型定義：1つの入力設定
type InputConfig = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  rules?: ValidationRole[];
};
type FormBuilderProps = {
  inputConfigs: InputConfig[];
  formData: Record<string, string>;
  onChange: ChangeHandler;
  applyToFormData: (field: string, value: string) => void;
};
const AuthInputList = ({
  inputConfigs,
  formData,
  onChange,
  applyToFormData,
}: FormBuilderProps) => {
  return (
    <div className="space-y-[16px]">
      {inputConfigs.map((config) => {
        if (config.type === "password") {
          return (
            <PasswordInput
              key={config.name}
              name={config.name}
              value={formData[config.name]}
              onChange={onChange}
              label={config.label}
              rules={config.rules}
              placeholder={config.placeholder}
            />
          );
        }
        if (config.type === "birthday") {
          return (
            <BirthdayInput
              key={config.name}
              name={config.name}
              onBirthdayChange={applyToFormData}
              label={config.label}
            />
          );
        }

        return (
          <InputBox
            key={config.name}
            name={config.name}
            type={config.type}
            value={formData[config.name]}
            onChange={onChange}
            label={config.label}
            rules={config.rules}
            placeholder={config.placeholder}
          />
        );
      })}
    </div>
  );
};

export default AuthInputList;
