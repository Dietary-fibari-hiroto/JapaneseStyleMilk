import styled from "styled-components";

const ButtonContainer = styled.button<{
  $type: boolean;
}>`
  width: 117px;
  height: 52px;
  border-radius: 8px;
  font-size: var(--header-s-rem);
  font-weight: Bold;
  color: ${({ $type }) =>
    $type
      ? "var(--text-button-primary_button)"
      : "var(--text-button-secondary_button)"};
  background: ${({ $type }) =>
    $type
      ? "var(--surface-button-primary_button)"
      : "var(--surface-button-secondary_button)"};
`;

type ButtonStyleProps = {
  type: boolean;
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
const SecondaryButton = ({ type, text, onClick }: ButtonStyleProps) => {
  return (
    <ButtonContainer type="button" $type={type} onClick={onClick}>
      {text}
    </ButtonContainer>
  );
};

export default SecondaryButton;
