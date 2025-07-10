import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Loading, ProsCons } from "../";
import { animationConfig } from "../../config/motionAnimateConfig";
import Avatar from "../common/Avatar";
import { SecondaryButton } from "../";
import { useWebRTC } from "../../api/webRtc/useWebRtc";
import { useOpponent } from "../../contexts/OpponentContext";

//マッチングの状態
enum MatchingState {
  AcceptStream = "acceptstream", //マイクの使用承諾
  Waiting = "waiting", //マッチ相手を待っている状態
  Success = "success", //マッチングが完了して話せる状態
  Fail = "fail", //マッチングが失敗した状態
}

//このページ内で再利用性のあるCSSクラス
const contentStyle = "space-y-[16px] flex flex-col";

const MatcingCard = () => {
  const { opponent, setOpponent } = useOpponent();
  /**以下テスト変数(pagesとの結合段階で使う) */
  //WebRTC
  const {
    localVideoRef,
    remoteVideoRef,
    canCall,
    audioURL,
    isRecording,
    isConnected,
    handleCall,
    startRecording,
    stopRecording,
  } = useWebRTC("a", setOpponent); // 固定ルーム名 "a" を使う
  //テスト用の賛否状態管理。(現在は親から受け取った情報を配列stateで管理する予定)
  const [testProsCons, setTestProsCons] = useState<boolean>(true);
  //ディベートテーマ(状態管理も担う)
  const [testTheme, setTestTheme] = useState<string | null>(
    "五条悟は両面宿儺より強いですか？"
  );
  //相手ユーザーのアイコン
  const userIcon =
    "https://matitaka.dawn-waiting.com/static/media/IMG_2883.345fbe743ae2b250d435.jpg";
  /*---ここまで---*/

  //マッチングの状態
  const [matchState, setMatchState] = useState<MatchingState>(
    MatchingState.AcceptStream
  );

  //マウント時の処理
  useEffect(() => {
    //通話要請を送信
    handleCall();
  }, []);
  // ローカル音声が取得できたらマッチング状態を「待機中」にする
  useEffect(() => {
    if (canCall) setMatchState(MatchingState.Waiting);
  }, [canCall]);
  //通話が接続されたときの処理。
  useEffect(() => {
    if (isConnected) setMatchState(MatchingState.Success);
  }, [isConnected]);
  //動作確認用
  /**
  useEffect(() => {
    const test = setTimeout(() => {
      setMatchState(MatchingState.Success);
    }, 3000);
    return () => clearTimeout(test);
  }, [matchState]);
 */
  //はい、いいえボタンの挙動
  const handleYes = () => {};
  const handleNo = () => {
    //動作確認用
    setMatchState(MatchingState.Waiting);
  };

  //メインのUI描画
  return (
    <motion.div
      {...animationConfig}
      className="fixed top-0 left-0 z-[3] h-full w-full"
      onClick={() => {
        window.location.reload();
      }}
    >
      <audio ref={remoteVideoRef} autoPlay />

      <div
        style={{ backdropFilter: "blur(5px)" }}
        className="absolute z-[3] top-0 left-0 bg-[#00000033]  w-screen h-screen "
      ></div>
      <div
        className={`absolute z-[5] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[780px] ${
          matchState === MatchingState.Success ? "h-[696px]" : "h-[540px]"
        } py-[32px] px-[56px] bg-[--surface-matching_card_frame] rounded-[32px] space-y-[28px] transition-all duration-[0.3s] ease-in-out`}
      >
        <div className={clsx(contentStyle, "")}>
          <p className="text-header-r text-[#FAFAFA] font-bold">
            ディベート相手
          </p>
          <div className="w-[668px] h-[280px] bg-[--surface-opponent_matching_card] rounded-[16px] flex-all-center">
            <AnimatePresence mode="wait">
              {matchState === MatchingState.AcceptStream && (
                <motion.div {...animationConfig}>
                  <p>マイクの使用を許可してください！</p>
                </motion.div>
              )}
              {matchState === MatchingState.Waiting && (
                <motion.div {...animationConfig}>
                  <Loading />
                </motion.div>
              )}
              {matchState === MatchingState.Success && (
                <motion.div {...animationConfig}>
                  <Avatar image={opponent?.img_url} size="xl" />
                </motion.div>
              )}
              {matchState === MatchingState.Fail && (
                <motion.div {...animationConfig}>
                  <div>fail</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={clsx(contentStyle, "")}>
          <p className="text-header-r text-[#FAFAFA] font-bold">
            ディベート内容
          </p>
          <div className="w-[668px] h-[52px] bg-[--surface-opponent_matching_card] rounded-[16px] flex-all-center">
            <AnimatePresence mode="wait">
              {matchState === MatchingState.Waiting && (
                <motion.div {...animationConfig}>
                  <Loading miniMode={true} />
                </motion.div>
              )}
              {matchState === MatchingState.Success && (
                <motion.div {...animationConfig}>
                  <div className="flex items-center space-x-[10px]">
                    <p className="fofnt-medium">{testTheme}</p>
                    <ProsCons witch={testProsCons} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={clsx(contentStyle, "")}>
          <AnimatePresence mode="wait">
            {matchState === MatchingState.Success && (
              <motion.div
                {...animationConfig}
                className="flex-all-center flex-col space-y-[24px]"
              >
                <p className="text-[#fafafa] text-header-r font-bold">
                  このトピックで進めますか？
                </p>{" "}
                <div className="flex-all-center space-x-[24px]">
                  <SecondaryButton
                    type={true}
                    text="はい"
                    onClick={handleYes}
                  />
                  <SecondaryButton
                    type={false}
                    text="いいえ"
                    onClick={handleNo}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MatcingCard;
