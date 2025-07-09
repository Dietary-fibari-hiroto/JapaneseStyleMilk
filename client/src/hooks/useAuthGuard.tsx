import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";

export const useAuthGuard = () => {
  const { account } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate("/login", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  }, [account, navigate]);
};

export const AuthCuardElement = () => {
  useAuthGuard();
  return <></>;
};
