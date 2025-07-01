import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthFormContainer, AuthInputList, FormButton } from "../../components";
import { useForm, Field, useApiError } from "../../hooks";
import Avatar from "../../components/common/Avatar";
import ImagesRoute from "../../assets/images/ImagesRoute";
const inputCategory = [
  {
    name: "img_url",
  },
];
const avatarList = [
  "avatar_XL_blue.svg",
  "avatar_XL_green.svg",
  "avatar_XL_orange.svg",
  "avatar_XL_pink.svg",
  "avatar_XL_purple.svg",
  "avatar_XL_red.svg",
  "avatar_XL_white.svg",
  "avatar_XL_yellow.svg",
];

const SelectAvatar = () => {
  const { formData, applyToFormData, handleChange } = useForm(inputCategory);
  const location = useLocation();
  const [selectImage, setSelectImage] = useState("");

  //前ページのformDataを受け取る
  const data = location.state;
  useEffect(() => {
    //applyToFormData(data);
    (Object.entries(data) as [string, string][]).forEach(([key, value]) => {
      applyToFormData(key, value);
    });
  }, [data]);
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <AuthFormContainer onSubmit={handleRegister}>
      <div className="text-center ">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          アバターを選択しましょう！
        </p>
        <p className="text-body-r text-[--text-body]">
          第一印象はアバターで決まる!?
        </p>
      </div>
      <div>
        <Avatar
          image={`http://localhost:4000/uploads/avatars/${selectImage}`}
          size="xl"
        />
      </div>
      <div className="flex justify-start flex-wrap  w-[500px] gap-[30px]">
        {" "}
        {avatarList.map((filename) => (
          <button
            className="size-auto "
            onClick={() => setSelectImage(filename)}
            key={filename}
          >
            <Avatar
              image={`http://localhost:4000/uploads/avatars/${filename}`}
              size="large"
            />
          </button>
        ))}
        <button className="size-auto " onClick={() => setSelectImage("")}>
          <Avatar image={ImagesRoute.upload_wh_icon} size="large" />
        </button>
      </div>
    </AuthFormContainer>
  );
};

export default SelectAvatar;
