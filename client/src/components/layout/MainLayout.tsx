import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="relative flex-1 flex-all-center flex-col ">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
