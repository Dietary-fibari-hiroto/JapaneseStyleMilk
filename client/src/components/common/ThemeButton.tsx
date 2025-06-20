import { useState } from "react";
import styled from "styled-components"; //enum
import ImagesRoute from "../../assets/images/ImagesRoute";

const ThemeButtonContainer = styled.button<{ $select: boolean }>`
  width: 216px;
  height: 40px;
  border-radius: 8px;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  justify-content: start;
  color: var(--color-neutral-1100);
  background: ${({ $select }) =>
    $select
      ? "var(--surface-button-theme_button_selected)"
      : "var(--surface-button-theme_button)"};
  &:hover {
    background: var(--surface-button-theme_button_hover);
  }
`;

type Props = {
  mode: boolean;
};
const ThemeButton = ({ mode }: Props) => {
  const [select, setSelect] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelect((prev) => !prev);
  };
  return (
    <ThemeButtonContainer onClick={handleClick} $select={select}>
      <img className="pr-[12px]" src={ImagesRoute.dark_mode_icon} />
      <p>ライトモード</p>
    </ThemeButtonContainer>
  );
};
export default ThemeButton;
