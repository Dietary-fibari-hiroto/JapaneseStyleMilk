import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AuthFormContainer, FormButton } from "../../components";
import { useForm } from "../../hooks";
import Avatar from "../../components/common/Avatar";
import ImagesRoute from "../../assets/images/ImagesRoute";

import axiosInstance from "../../utils/axiosInstance";
import { AccountType, register } from "../../api/auth";
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
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectImage, setSelectImage] = useState("");
  const [selectAvatar, setSelectAvatar] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  //前ページのformDataを受け取る
  const data = location.state;
  useEffect(() => {
    //applyToFormData(data);
    (Object.entries(data) as [string, string][]).forEach(([key, value]) => {
      applyToFormData(key, value);
    });
  }, [data]);
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const imageData = new FormData();
      imageData.append("image", image);

      try {
        const res = await axiosInstance.post("/upload/images", imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("アップロード成功:", res.data);
      } catch (error) {
        console.log("アップロード失敗");
      }
    } else {
      applyToFormData("img_url", selectAvatar);
    }

    //アカウント登録
    try {
      console.log("haittery");
      const res = await register(formData as AccountType);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectImage) setIsFormValid(true);
  }, [selectImage]);

  const onImageClick = () => {
    fileInputRef.current?.click(); // input を擬似クリック
  };
  const handleImageChenge = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("選択された画像:", file);
      applyToFormData("img_url", file.name);
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectImage(objectUrl);
    }
  };

  //テスト用useEffect
  useEffect(() => {
    console.log("最終formData:", formData);
  }, [formData]);
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
        <Avatar image={`${selectImage}`} size="xl" />
      </div>
      <div className="flex justify-start flex-wrap  w-[500px] gap-[30px]">
        {" "}
        {avatarList.map((filename) => (
          <button
            type="button"
            className="size-auto "
            onClick={() => {
              setSelectImage(
                `http://localhost:4000/uploads/avatars/${filename}`
              );
              setSelectAvatar(filename);
              setImage(null);
            }}
            key={filename}
          >
            <Avatar
              image={`http://localhost:4000/uploads/avatars/${filename}`}
              size="large"
            />
          </button>
        ))}
        <button
          type="button"
          className="size-[64px] rounded-full flex-all-center bg-black"
          onClick={onImageClick}
        >
          <img className="size-1/2" src={ImagesRoute.upload_wh_icon} />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChenge}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>
      <div className="w-full space-y-[20px] flex-all-center flex-col">
        <FormButton isValid={isFormValid} isConnecting={isConnecting} />
      </div>
    </AuthFormContainer>
  );
};

export default SelectAvatar;
