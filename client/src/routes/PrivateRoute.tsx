import { Navigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { ReactNode, useEffect } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { account, isFetching } = useAccount();
  useEffect(() => {}, [account]);
  if (isFetching) return <div>Loading...</div>; // or Spinner
  return account ? children : <Navigate to="/login/require" />;
};

export default PrivateRoute;
