import { login } from "../../api/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormContainer, AuthInputList, FormButton } from "../../components";
import { useForm, useApiError } from "../../hooks";
import { useAccount } from "../../contexts/AccountContext";

const RequireLogin = () => {
  const navigate = useNavigate();
  return (
    <AuthFormContainer
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate("/login");
      }}
    >
      <div className="text-center flex-all-center flex-col">
        <p className="text-header-l font-bold text-[--text-header_primary]">
          アクセスにはログインが必要です
        </p>
        <p className="text-body-r text-[--text-body]">
          このページを閲覧するにはログインが必要です。
        </p>
      </div>

      <div className="w-full space-y-[20px] flex-all-center flex-col">
        <FormButton label="ログイン" />
        <p>
          まだアカウントをお持ちでない方は、
          <Link className="text-[--text-link] font-bold" to="/register">
            こちらからどうぞ
          </Link>
        </p>
      </div>
    </AuthFormContainer>
  );
};

export default RequireLogin;
