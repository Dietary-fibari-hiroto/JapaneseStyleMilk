import { useLocation } from "react-router-dom";

type ComponentProps = {
  pathname: string;
  icon: string;
  name: string;
};
const NavItem = ({ pathname, icon, name }: ComponentProps) => {
  const location = useLocation();

  return (
    <div
      className={`${
        pathname === location.pathname ? "bg-[--surface-nav_selected]" : ""
      } rounded-[8px] text-[--text-nav] w-[224px] h-[42px] bg-none hover:bg-[--surface-nav_hover] px-[12px] py-[10px] flex items-center justify-start space-x-[16px]`}
    >
      <img className="size-[18px]" src={icon} />
      <p>{name}</p>
    </div>
  );
};

export default NavItem;
