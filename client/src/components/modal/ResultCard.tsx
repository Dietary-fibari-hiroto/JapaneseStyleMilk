import { useNavigate } from "react-router-dom";
import ImagesRoute from "../../assets/images/ImagesRoute";
import { useState } from "react";
import SecondaryButton from "../common/SecondaryButton";
type Props = {
  win: boolean;
};
const ResultCard = ({ win }: Props) => {
  //はいをされたときの処理
  const handleYes = () => {};
  //いいえを押されたときの処理
  const handleNO = () => {};

  return (
    <div className="w-[762px] h-[622px] bg-[--color-neutral-950] rounded-[32px] flex-all-center flex-col space-y-[36px] text-[--color-neutral-100] ">
      <figure className="size-[300px]">
        <img src={ImagesRoute.trophy_big} />
      </figure>
      <div className="flex-all-center flex-col space-y-[10px]">
        <p className="text-header-l font-bold">
          {win ? "あなたが勝ちました。" : "あなたは負けました。"}
        </p>
        <p className="text-body-l font-medium">フィードバック確認しますか？</p>
        <div className="flex-all-center space-x-[24px]">
          <SecondaryButton type={true} text="はい" onClick={handleYes} />
          <SecondaryButton type={false} text="いいえ" onClick={handleNO} />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
