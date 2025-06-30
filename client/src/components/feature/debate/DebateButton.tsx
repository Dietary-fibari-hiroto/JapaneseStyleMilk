import { useReducer, useState } from "react";
import ImagesRoute from "../../../assets/images/ImagesRoute";
import { useEffect } from "react";
import styled from "styled-components";

//CSS定義
const DebateButtonContainer = styled.div<{
  $miniMode: boolean;
  $cancelOpen: boolean;
  $flafOpen: boolean;
}>`
  min-width: 192px;
  height: 200px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fafafa;

  #send-button {
    overflow: hidden;
    width: ${({ $miniMode }) => ($miniMode ? "36px" : "72px")};
    height: ${({ $miniMode }) => ($miniMode ? "36px" : "72px")};
    border-radius: 50%;
    background: var(--color-main-default);
    margin: 0 25px;
    transition: width 0.3s ease, height 0.3s ease;
    #icon-container {
      display: flex;
      transform: translateX(0%);
      transition: transform 0.3s ease;
    }
    .icon-contents {
      min-width: ${({ $miniMode }) => ($miniMode ? "36px" : "72px")};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.3s ease;
      > img {
        width: ${({ $miniMode }) => ($miniMode ? "14px" : "24px")};
        transition: width 0.3s ease;
      }
    }
  }
  #flag-button {
    overflow: hidden;
    width: ${({ $flafOpen }) => ($flafOpen ? "100px" : "36px")};
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: start;
    border-radius: 18px;
    background: var(--color-neutral-900);
    padding: 0 ${({ $flafOpen }) => ($flafOpen ? "20px" : "0")};
    transition: width 0.3s ease, padding 0.3s ease;
  }
  #cancel-button {
    overflow: hidden;
    width: ${({ $cancelOpen }) => ($cancelOpen ? "144px" : "36px")};
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: start;
    border-radius: 18px;
    background: var(--color-orange-600);
    padding: 0 ${({ $cancelOpen }) => ($cancelOpen ? "20px" : "0")};
    transition: width 0.3s ease, padding 0.3s ease;
  }
  .icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

//真ん中のメインとなるボタンの表示アニメーションを判断するためのENUM
const MainButtonState = {
  IDLE: 0,
  MIC: 1,
  NOT_MIC: 2,
  MINI: 3,
} as const;
type MainButtonType = (typeof MainButtonState)[keyof typeof MainButtonState];

//各ボタンのアニメーション発火を管理するオブジェクト
type State = {
  miniMode: boolean;
  cancelOpen: boolean;
  flagOpen: boolean;
};
type Action =
  | { type: "USUAL" }
  | { type: "ENTER_CANCEL" }
  | { type: "ENTER_FLAG" };

const DebateButton = () => {
  //中央のメインボタン
  const [processMainButton, setProcessMainButton] = useState(0);

  //その他のボタンのアニメーション管理
  const initialState: State = {
    miniMode: false,
    cancelOpen: false,
    flagOpen: false,
  };
  const buttonReducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.type) {
      case "USUAL":
        return { miniMode: false, cancelOpen: false, flagOpen: false };
      case "ENTER_CANCEL":
        return { ...state, miniMode: true, cancelOpen: true };
      case "ENTER_FLAG":
        return { ...state, miniMode: true, flagOpen: true };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(buttonReducer, initialState);

  return (
    <DebateButtonContainer
      $miniMode={state.miniMode}
      $cancelOpen={state.cancelOpen}
      $flafOpen={state.flagOpen}
      id="flex w-[192px] items-center justify-between"
    >
      <button
        id="flag-button"
        onMouseEnter={() => dispatch({ type: "ENTER_FLAG" })}
        onMouseLeave={() => dispatch({ type: "USUAL" })}
      >
        <div className="icon">
          <img src={ImagesRoute.flag_button} />
        </div>
        <p>降参</p>
      </button>
      <button id="send-button">
        {" "}
        <div id="icon-container">
          <div className="icon-contents">
            <img src={ImagesRoute.send_button} />
          </div>
          <div className="icon-contents">
            <img src={ImagesRoute.mic_button} />
          </div>
          <div className="icon-contents">
            <img src={ImagesRoute.not_mic_button} />
          </div>
        </div>
      </button>
      <button
        id="cancel-button"
        onMouseEnter={() => dispatch({ type: "ENTER_CANCEL" })}
        onMouseLeave={() => dispatch({ type: "USUAL" })}
      >
        <div className="icon">
          <img src={ImagesRoute.cancel_button} />
        </div>
        <p>ターン終了</p>
      </button>
    </DebateButtonContainer>
  );
};

export default DebateButton;
