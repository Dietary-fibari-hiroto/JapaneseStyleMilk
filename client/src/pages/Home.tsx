import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrimaryButton from "../components/common/PrimaryButton";
import { getMe } from "../api/auth";
import { useAccount } from "../contexts/AccountContext";
import { useOpponent } from "../contexts/OpponentContext";
import { useWebRTC } from "../api/webRtc/useWebRtc";
import { DebateButton, VersusAvatars, MatchingCard } from "../components";
import SectionHeader from "../components/common/SectionHeader";
export enum GameProgress {
  None = "none", //ゲームが始まっていない状態
  Matching = "matching", //マッチング状態
  StandBy = "standby", //ゲーム内待機
  Waite = "waite", //お互いのシステム状態合わせているときの待機状態
  Turn1 = "turn1", //1ターン目
  Turn2 = "turn2", //2ターン目
  Turn3 = "turn3", //3ターン目
  Result = "result", //結果
}
const Home = () => {
  const { opponent, setOpponent } = useOpponent();
  const { account, setIsFetching } = useAccount();
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

  return (
    <div className="w-[80%]">
      <audio ref={remoteVideoRef} autoPlay />
      <AnimatePresence mode="wait">
        {gameProgress === GameProgress.Matching && (
          <MatchingCard
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
          <SectionHeader mode="anime" gameProgress={gameProgress} />
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
