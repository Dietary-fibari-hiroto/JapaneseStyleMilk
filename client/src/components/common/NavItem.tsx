type ComponentProps = {
  pathname: string;
  icon: string;
  name: string;
};
const NavItem = ({ pathname, icon, name }: ComponentProps) => {
  return (
    <div className="w-[224px] h-[42px] bg-none hover:bg-[--surface-nav_hover] px-[12px] py-[10px] flex items-center justify-start space-x-[16px]">
      <img className="size-[18px]" src={icon} />
    </div>
  );
};

export default NavItem;
