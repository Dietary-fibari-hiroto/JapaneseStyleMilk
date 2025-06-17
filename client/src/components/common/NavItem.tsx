import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";

type ComponentProps = {
  path: string;
  icon: string;
  name: string;
  isOpen: boolean;
};
/**
 *
 * @argument path 引数と滞在しているurlが同じ場合bgに変更を加える
 * @argument icon imgタグで使う
 * @argument name 表示名
 * @argument isOpen サイドバーがOpen状態かどうか
 * @returns
 * <NavItem pathname = "/" icon ={ImagesRoute} name = "home"/>
 */

//CSSプロパティ
const NavContainer = styled.button<{ isOpen: boolean; isPath: boolean }>`
  background: ${(props) => (props.isPath ? "var(--surface-nav_selected)" : "")};
  border-radius: 8px;
  color: var(--text-nav);
  font-size: var(--body-s);
  width: ${(props) => (props.isOpen ? "224px" : "42px")};
  height: 42px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: start;

  transition: all 0.1s ease-in;
  &:hover {
    background: var(--surface-nav_hover);
  }
  > * + * {
    margin-left: 16px;
  }

  p {
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
    transition: opacity 0.3s 0.3s, visibility 0s 0s;
  }
`;

const NavItem = ({ path, icon, name, isOpen }: ComponentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(path);
  };
  return (
    <NavContainer
      onClick={handleClickButton}
      isOpen={isOpen}
      isPath={path === location.pathname}
    >
      <img className="size-[18px]" src={icon} />
      <p>{name}</p>
    </NavContainer>
  );
};

export default NavItem;
