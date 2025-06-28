import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="w-screen h-screen flex-all-center">
      <div className="w-[80vw] h-[80lvh] flex px-[32px] justify-around items-center drop-shadow-2xl bg-white rounded-[24px]">
        <Outlet />
        <section className="w-[624px] h-[640px] rounded-[24px] bg-[--color-neutral-1000]"></section>
      </div>
    </div>
  );
};

export default AuthLayout;
