import { useForm } from "../../hooks";
import { InputBox } from "../../components";
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
];
const Register = () => {
  const { formData, handleChange, applyToFormData } = useForm(inputCategory);

  return (
    <div className="flex-all-center flex-col space-y-[44px]">
      <div className="text-center ">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          LANGBATEへようこそ
        </p>
        <p className="text-body-r text-[--text-body]">
          楽しく本格的なディベートで、英語力を磨こう。
        </p>
      </div>
      <form>
        {inputCategory.map((config) => {
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
      </form>
    </div>
  );
};
export default Register;
