import { useForm } from "../hooks";
import { InputBox, PasswordInput, BirthdayInput } from "../components";
const inputCategory = [
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
  {
    name: "birthday",
    type: "birthday",
    label: "生年月日",
  },
];

const Test = () => {
  const { formData, handleChange, resetForm, applyToFormData } =
    useForm(inputCategory);

  const handleTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <form className="bg-[#cccccc]" onSubmit={handleTest}>
      {inputCategory.map((config) => {
        if (config.type === "password") {
          return (
            <PasswordInput
              key={config.name}
              name={config.name}
              value={formData[config.name]}
              onChange={handleChange}
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
            onChange={handleChange}
            label={config.label}
            rules={config.rules}
            placeholder={config.placeholder}
          />
        );
      })}
      <button type="submit">test</button>
    </form>
  );
};

export default Test;
