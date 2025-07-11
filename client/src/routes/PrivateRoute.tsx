import { Navigate } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { ReactNode } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { account, isFetching } = useAccount();

  if (isFetching) return <div>Loading...</div>; // or Spinner
  return account ? children : <Navigate to="/login/require" replace />;
};

export default PrivateRoute;
