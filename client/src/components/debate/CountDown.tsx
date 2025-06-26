import { useEffect, useState } from "react";
import styled from "styled-components";
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
  .slider-text {
    /* ← ホバーでX方向にスライド */
  }
`;

const CountDown = () => {
  const [animateProcess, setAnimateProcess] = useState(0);
  const waitInitialTime = 2000; //最初の待ち時間
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
  };
  useEffect(() => {
    countDownProcedure();
  }, []);
  return (
    <div className=" absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[--surface-matching_card_frame] size-[679px] rounded-[44px] flex flex-col items-center justify-evenly text-[--text-card-matching-card-header]">
      <p className="text-header-l">1の時自分の意見を言ってください</p>
      <SliderContainer $start={animateProcess}>
        <div className="flex  text-center slider-text">
          {" "}
          <p className="">1</p> <p>2</p> <p>3</p>
        </div>
      </SliderContainer>
    </div>
  );
};

export default CountDown;
