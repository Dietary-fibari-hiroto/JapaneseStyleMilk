import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { animationConfig } from "../../../config/motionAnimateConfig";
const SliderContainer = styled.div<{ $start: number }>`
  overflow: hidden;
  position: relative;
  width: 185px;
  height: 323px;

  display: flex;
  align-item: center;

  justify-content: center;

  p {
    min-width: 185px;
    min-height: 323px;
    font-weight: bold;
    font-size: 250px;
    transform: translateX(
      ${({ $start }) => {
        switch ($start) {
          case 1:
            return "-100%";
          case 2:
            return "0%";
          case 3:
            return "100%";
          default:
            return "-100%";
        }
      }}
    );
    opacity: ${({ $start }) => ($start >= 1 ? "1" : "0")};
    transition: opacity 0.3s, transform 0.3s ease-in-out;
  }
`;

const labels = [
  {
    label: "Round1シンキングタイム",
    explain: "テーマについて、あなたの立場や伝えたい主張を整理してみましょう。",
  },
  {
    label: "Round1:主張",
    explain:
      "自分の立場と、その理由を簡潔に伝えてみましょう。ポイントは「わかりやすさ」と「説得力」です！",
  },
  {
    label: "Round2シンキングタイム",
    explain:
      "相手の話をふまえて、反論の準備をしましょう。「どこが弱点だったか？」「どう切り返すか？」を考える時間です。",
  },
  {
    label: "Round2:反論",
    explain:
      "相手の主張に対しての疑問点や矛盾を指摘して、自分の立場を補強しましょう。相手を否定しすぎず、自分の論理に引き込む意識も大切です。",
  },
  {
    label: "Round3シンキングタイム",
    explain:
      "自分の主張が「一貫していたか」「納得できるか」を振り返りましょう。最後に伝えたいメッセージや印象づけの言葉も考えておくと効果的！",
  },
  {
    label: "Round3:結論",
    explain:
      "これまでの意見をまとめて、自分の立場を再確認しましょう。聞き手の心に残るよう、はっきりと、簡潔に伝えるのがポイントです！",
  },
];

type props = {
  currentIndex: number;
  setShowCount: (prev: boolean) => void;
};

const CountDown = ({ currentIndex, setShowCount }: props) => {
  const [animateProcess, setAnimateProcess] = useState(0);
  const waitInitialTime = 5000; //最初の待ち時間
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const countDownProcedure = async () => {
    const nextProcess = () => {
      setAnimateProcess((prev) => prev + 1);
    };
    await wait(waitInitialTime);
    nextProcess();
    await wait(1000);
    nextProcess();
    await wait(1000);
    nextProcess();
    await wait(1000);
    setShowCount(false);
  };
  useEffect(() => {
    countDownProcedure();
  }, []);
  return (
    <motion.div
      {...animationConfig}
      className="fixed top-0 left-0 z-[3] h-full w-full"
    >
      <div
        style={{ backdropFilter: "blur(5px)" }}
        className="absolute z-[3] top-0 left-0 bg-[#00000033]  w-screen h-screen "
      />
      <div className=" absolute top-1/2 left-1/2 z-[10] translate-x-[-50%] translate-y-[-50%] bg-[--surface-matching_card_frame] size-[679px] rounded-[44px] flex flex-col items-center justify-evenly text-[--text-card-matching-card-header]">
        <p className="text-header-l">{labels[currentIndex - 2].label}</p>
        <p className="text-header-s w-[600px] text-center">
          {labels[currentIndex - 2].explain}
        </p>{" "}
        <p className="text-header-s w-[600px] text-center text-[#bf0000]">
          *カウントダウン終了と同時に、あなたのターンが始まります。
        </p>
        <SliderContainer $start={animateProcess}>
          <div className="flex  text-center">
            {" "}
            <p className="">1</p> <p>2</p> <p>3</p>
          </div>
        </SliderContainer>
      </div>
    </motion.div>
  );
};

export default CountDown;
