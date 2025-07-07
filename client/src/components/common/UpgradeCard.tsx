import styled from "styled-components";
import ImagesRoute from "../../assets/images/ImagesRoute";
import PrimaryButton from "./PrimaryButton";
const animation = {
  initial: { filter: "blur(10px) saturate(0%)", opacity: 0 },
  animate: { filter: "blur(0px) saturate(100%)", opacity: 1 },
  exit: { filter: "blur(10px) saturate(0%)", opacity: 0 },
  transition: { duration: 0.5 },
};

type Props = {
  isOpen: boolean;
};

const ContainerDiv = styled.div<{ $isOpen: boolean }>`
  width: 228px;
  height: 224px;
  padding: 16px 20px;
  border-radius: 24px;
  border: solid 2px var(--surface-upgrade_card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  background: var(--surface-background);
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: ${({ $isOpen }) =>
    $isOpen ? "opacity 0.3s 0.3s ease, visibility 0s" : "all 0s"};
`;

const UpgradeCard = ({ isOpen }: Props) => {
  return (
    <ContainerDiv $isOpen={isOpen}>
      <div className="w-[196px] h-[106px]">
        <img className="size-[44px]" src={ImagesRoute.upgrade_Icon} />
        <p className="text-header-xs text-[--text-header-primary] font-bold pt-[12px]">プロにアップグレード</p>
        <p>たくさんの得点を解放しよう！</p>
      </div>
      <PrimaryButton
        size="Meddium"
        color="Main"
        shape="Round"
        label="アップグレード"
      />
    </ContainerDiv>
  );
};

export default UpgradeCard;
