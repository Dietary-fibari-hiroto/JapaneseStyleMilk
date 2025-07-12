import { Navigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { ReactNode } from "react";

const PrivateRoute = ({ Component }: { Component: React.FC }) => {
  const { account, isFetching } = useAccount();

  if (isFetching) return <div>Loading...</div>; // or Spinner
  return account ? <Component /> : <Navigate to="/login/require" replace />;
};

export default PrivateRoute;
