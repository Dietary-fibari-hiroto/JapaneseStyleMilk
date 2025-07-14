import Spline from "@splinetool/react-spline";

import { Outlet } from "react-router-dom";
import ImagesRoute from "../../assets/images/ImagesRoute";
const AuthLayout = () => {
  return (
    <div className="w-screen h-screen flex-all-center">
      <div className="w-[90vw] h-[90lvh] flex  justify-between items-center drop-shadow-2xl bg-white rounded-[24px] px-[100px]">
        <Outlet />
        <section className="w-[624px] h-[80lvh] rounded-[24px] bg-[#cccccc] flex-all-center">
          <img className="w-1/2" src={ImagesRoute.logo_icon} />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
