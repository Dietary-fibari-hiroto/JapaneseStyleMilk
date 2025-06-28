import { useState, ChangeEvent } from "react";

interface Field {
  name: string;
}
type FormData = Record<string, string>;

const useForm = (fields: Field[]) => {
  const initialState: FormData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as FormData);

  const [formData, setFormData] = useState<FormData>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyToFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, applyToFormData, resetForm };
};

export default useForm;
