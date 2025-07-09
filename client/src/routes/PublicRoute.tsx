import { Navigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { useEffect } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { account, isFetching } = useAccount();
  useEffect(() => {}, [account]);
  if (isFetching) return <div>Loading...</div>;
  return account ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
