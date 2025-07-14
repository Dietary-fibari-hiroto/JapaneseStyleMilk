import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrimaryButton from "../components/common/PrimaryButton";
import { useAccount } from "../contexts/AccountContext";
import { useOpponent } from "../contexts/OpponentContext";
import { useWebRTC } from "../api/webRtc/useWebRtc";
import {
  DebateButton,
  VersusAvatars,
  MatchingCard,
  CountDown,
  ResultCard,
} from "../components";

import SectionHeader from "../components/common/SectionHeader";
import { GameProgress, GameProgressIndexMap } from "../types/enum";

const Home = () => {
  const { opponent, setOpponent } = useOpponent();
  const { account, setIsFetching } = useAccount();
  const [currentTurn, setCurrentTurn] = useState(0); // ターン管理
  const [gameStart, setGameStart] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const thinkingTime = 15000;
  const turnTime = 15000;
  /* アニメーション設定ここまで */

  const {
    localVideoRef,
    remoteVideoRef,
    canCall,
    audioURL,
    isRecording,
    handleCall,
    startRecording,
    stopRecording,
    isConnected,
  } = useWebRTC("a", setOpponent); // 固定ルーム名 "a" を使う
  /**
   * ---ここまでが本ページで使うカスタムフックやコンテキストの初期化処理---
   */

  //ゲームの状態管理
  const [gameProgress, setGameProgress] = useState<GameProgress>(
    GameProgress.None
  );

  const [testTheme, setTestTheme] = useState<string | null>(
    "五条悟は両面宿儺より強いですか？"
  );

  //ターンのUI部分の進行
  useEffect(() => {
    setCurrentTurn(GameProgressIndexMap[gameProgress]);
  }, [gameProgress]);
  //シンキングタイムをおわらせにきた
  useEffect(() => {
    if (gameStart) {
      if ([2, 3, 4, 5, 6, 7].includes(currentTurn)) {
        setShowCount(true);
      }
      if ([2, 4, 6].includes(currentTurn)) {
        const timeoutId = setTimeout(() => {
          setCurrentTurn((prev) => prev + 1);
        }, thinkingTime);
        return () => clearTimeout(timeoutId);
      }
      if ([3, 5, 7].includes(currentTurn)) {
        const timeoutId = setTimeout(() => {
          setCurrentTurn((prev) => prev + 1);
        }, turnTime);
        return () => clearTimeout(timeoutId);
      }

      if ([0, 1].includes(currentTurn)) {
        const timeoutId = setTimeout(() => {
          setCurrentTurn((prev) => prev + 1);
        }, 10000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentTurn, gameStart]);

  return (
    <div className="w-[80%]">
      <audio ref={remoteVideoRef} autoPlay />
      <AnimatePresence mode="wait">
        {" "}
        {showCount && (
          <CountDown setShowCount={setShowCount} currentIndex={currentTurn} />
        )}
        {currentTurn >= 8 && <ResultCard win={true} />}
        {gameProgress === GameProgress.Matching && (
          <MatchingCard
            setGameStart={setGameStart}
            remoteVideoRef={remoteVideoRef}
            canCall={canCall}
            isConnected={isConnected}
            handleCall={handleCall}
            setGameProgress={setGameProgress}
          />
        )}
      </AnimatePresence>
      <div className="w-full h-full flex flex-col space-y-[50px]">
        {gameProgress === GameProgress.None ? (
          <div className="text-start">
            <p className="text-header-l font-bold text-[--text-header_primary]">
              こんにちは{account?.name}さん
            </p>
            <p className="text-header-l font-bold text-[--text-header_secondary]">
              今日もディベートやる？
            </p>
          </div>
        ) : (
          <SectionHeader currentTurn={currentTurn} mode="anime" />
        )}
        <VersusAvatars img_url={account?.img_url} opp_url={opponent?.img_url} />
        <div className="flex-all-center">
          {gameProgress === GameProgress.None && (
            <PrimaryButton
              size="Large"
              color="Main"
              shape="Round"
              label="ディベート開始"
              onClick={() => {
                setGameProgress(GameProgress.Matching);
              }}
            />
          )}
          {gameProgress !== GameProgress.None && <DebateButton />}
        </div>
      </div>
    </div>
  );
};

export default Home;
