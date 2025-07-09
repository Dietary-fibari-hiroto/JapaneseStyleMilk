import { Navigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { ReactNode, useEffect } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { account, isFetching } = useAccount();

  if (isFetching) return <div>Loading...</div>; // or Spinner
  return account ? children : <Navigate to="/login/require" replace />;
};

export default PrivateRoute;
