import { useState, useEffect } from "react";

import styled, { keyframes } from "styled-components";

const EllipseMotion = keyframes`
  0% { transform:translateY(0%); }
  50% { transform:translateY(-100%); }
  100% {    transform:translateY(0%);
    }
`;
const LoadingContainer = styled.div<{
  $miniMode?: boolean;
  $isWhite?: boolean;
}>`
  width: ${({ $miniMode }) => ($miniMode ? "60px" : "100px")};
  display: flex;
  justify-content: space-between;

  .motion {
    animation: ${EllipseMotion} 1s ease forwards;
  }

  > div {
    width: ${({ $miniMode }) => ($miniMode ? "12px" : "20px")};
    height: ${({ $miniMode }) => ($miniMode ? "12px" : "20px")};
    border-radius: 10px;
    background: ${({ $isWhite }) => ($isWhite ? "#ffffff" : "#000000")};
  }
`;
type MiniMode = {
  miniMode?: boolean;
  isWhite?: boolean;
};
const Loading = ({ miniMode = false, isWhite = false }: MiniMode) => {
  //モーションの間隔秒数(ms)
  const motionInterval = 500;
  //プロセスカウンター
  const [count, setCount] = useState(1);
  const [motionProcess, setMotionProcess] = useState({
    first: true,
    second: false,
    third: false,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (count) {
        case 0:
          setMotionProcess({ first: true, second: false, third: true });
          break;
        case 1:
          setMotionProcess({ first: true, second: true, third: false });
          break;
        case 2:
          setMotionProcess({ first: false, second: true, third: true });
          break;
        default:
          // 3以上はリセットする例
          setCount(0);
          break;
      }
      setCount((prev) => prev + 1);
      if (count >= 2) {
        setCount(0);
      }
    }, motionInterval);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <LoadingContainer $miniMode={miniMode} $isWhite={isWhite}>
      <div className={motionProcess.first ? "motion" : ""} />
      <div className={motionProcess.second ? "motion" : ""} />
      <div className={motionProcess.third ? "motion" : ""} />
    </LoadingContainer>
  );
};

export default Loading;
