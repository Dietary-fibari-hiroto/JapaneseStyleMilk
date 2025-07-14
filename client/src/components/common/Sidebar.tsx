import { useState } from "react";
import ImagesRoute from "../../assets/images/ImagesRoute";
import styled from "styled-components";
import NavItem from "./NavItem";
import UpgradeCard from "./UpgradeCard";
import { logout } from "../../api/auth";

import { useAccount } from "../../contexts/AccountContext";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

//後でAPI接続する時に使うために変数化した。
const testItem = { name: "山田ジョン", rank: "ゴールドランク" };

//ナビゲーションのリスト
const navList = [
  { name: "ホーム", path: "/home", icon: ImagesRoute.home_icon },
  {
    name: "ダッシュボード",
    path: "/dashboard/:accountId",
    icon: ImagesRoute.dash_board_icon,
  },
  { name: "プロフィール", path: "", icon: ImagesRoute.profile_icon },
  { name: "設定", path: "", icon: ImagesRoute.setting_icon },
];

//サイドバーのcss定義
const AsideBar = styled.aside<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? "280px" : "72px")};
  height: 100lvh;
  background: var(--surface-sidebar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  flex-shrink: 0;

  transition: width 0.3s ease;

  .close-hidden {
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transition: opacity 0.3s 0.3s, visibility 0s 0s;
  }
  .close-hidden > * {
    display: ${({ $isOpen }) => ($isOpen ? "" : "none")};
  }
  .horizontal-element {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #open-button {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
  > section {
    width: 100%;
    padding: 16px;
  }
  * {
    transition: width 0.3s 0.2s, transform 0.3s 0.2s;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const { account, setAccount } = useAccount();
  //バーがオープンしたときに使う状態管理
  const [isOpen, setIsOpen] = useState(true);
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logout();
    setAccount(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <AsideBar $isOpen={isOpen}>
      {/*Navigateあたり*/}
      <section className="relative space-y-[16px]">
        <div className="horizontal-element">
          <button
            onClick={handleOpen}
            id="open-button"
            className={`flex-all-center flex-shrink-0 ${
              isOpen ? "bg-[--surface-nav_selected]" : ""
            }`}
          >
            <img
              className="size-[24px]"
              src={ImagesRoute.close_side_bar_icon}
            />
          </button>
          <img className="h-[40px] close-hidden" src={ImagesRoute.logo_icon} />
        </div>
        <div className={`${isOpen ? "translate-x-[12px]" : ""} space-y-[4px] `}>
          {navList.map((nav, index) => (
            <NavItem key={index} isOpen={isOpen} {...nav} />
          ))}
        </div>

        <div className="px-[6px]">
          <UpgradeCard isOpen={isOpen} />
        </div>
      </section>
      {/*userプロフィールあたり*/}
      <section className="horizontal-element bg-[--surface-user_profile] h-[78px] ">
        <div className="flex justify-start items-center space-x-[12px]">
          {" "}
          <Avatar size="small" image={`${account?.img_url}`} />
          <div className={` space-y-[4px] close-hidden`}>
            <p className={`font-bold `}>{account?.name}</p>
            <p>{testItem.rank}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="close-hidden">
          {" "}
          <img
            className="size-[18px] flex flex-shrink-0 rounded-[50%] "
            src={ImagesRoute.log_out_icon}
          />
        </button>
      </section>
    </AsideBar>
  );
};

export default Sidebar;
