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

/**使い方
 *         <ThemeButton
          title="ダークモード"
          img={ImagesRoute.dark_mode_icon}
          mode={naightMode}
          onClick={() => setNightMode((prev) => true)}
        />
 */
type Props = {
  mode: boolean;
  img: string;
  title: string;
  onClick: () => void;
};
const ThemeButton = ({ mode, img, title, onClick }: Props) => {
  return (
    <ThemeButtonContainer onClick={onClick} $select={mode}>
      <img className="pr-[12px]" src={img} />
      <p>{title}</p>
    </ThemeButtonContainer>
  );
};
export default ThemeButton;
