import Spline from "@splinetool/react-spline";

import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="w-screen h-screen flex-all-center">
      <div className="w-[90vw] h-[90lvh] flex  justify-between items-center drop-shadow-2xl bg-white rounded-[24px] px-[100px]">
        <Outlet />
        <section className="w-[624px] h-[640px] rounded-[24px] bg-[--color-neutral-1000]">
          {" "}
          <Spline scene="https://prod.spline.design/NU1-Vy6sQXOZ0ke0/scene.splinecode" />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
