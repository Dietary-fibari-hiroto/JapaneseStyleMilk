import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImagesRoute from "../../assets/images/ImagesRoute";
import { animationConfig } from "../../config/motionAnimateConfig";
import SecondaryButton from "../common/SecondaryButton";
type Props = {
  win: boolean;
};
const ResultCard = ({ win }: Props) => {
  const navigate = useNavigate();
  //はいをされたときの処理
  const handleYes = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/home");
  };
  //いいえを押されたときの処理
  const handleNO = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/dashboard/evaluation/:historyId");
  };

  return (
    <motion.div
      {...animationConfig}
      className="fixed top-0 left-0 z-[3] h-full w-full"
    >
      {" "}
      <div
        style={{ backdropFilter: "blur(5px)" }}
        className="absolute z-[3] top-0 left-0 bg-[#00000033]  w-screen h-screen "
      />
      <div className=" absolute top-1/2 left-1/2 z-[10] translate-x-[-50%] translate-y-[-50%] w-[762px] h-[622px] bg-[--color-neutral-950] rounded-[32px] flex-all-center flex-col space-y-[36px] text-[--color-neutral-100] ">
        <figure className="size-[300px]">
          <img src={ImagesRoute.trophy_big} />
        </figure>
        <div className="flex-all-center flex-col space-y-[10px]">
          <p className="text-header-l font-bold">
            {win ? "あなたが勝ちました。" : "あなたは負けました。"}
          </p>
          <p className="text-body-l font-medium">
            フィードバック確認しますか？
          </p>
          <div className="flex-all-center space-x-[24px]">
            <SecondaryButton type={true} text="はい" onClick={handleYes} />
            <SecondaryButton type={false} text="いいえ" onClick={handleNO} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
