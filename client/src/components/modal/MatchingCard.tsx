import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Loading from "../common/Loading";
import Avatar from "../common/Avatar";
import { SecondaryButton } from "../";

enum MatchingState {
  Waiting = "waiting",
  Success = "success",
  Fail = "fail",
}

const animationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },

  transition: { duration: 0.3 },
};

const contentStyle = "space-y-[16px] flex flex-col";

//賛否を表示する要素
type propCons = { witch: boolean };
const ProsCons = ({ witch }: propCons) => {
  if (witch) {
    return (
      <div className="w-[60px] h-[38px] bg-[--surface-debate_position_tag] text-[--text-debate_position_text] rounded-[6px] font-bold flex-all-center">
        否定
      </div>
    );
  } else {
    return (
      <div className="w-[60px] h-[38px] bg-[--text-debate_position_text] text-[--surface-debate_position_tag] rounded-[6px] font-bold flex-all-center">
        肯定
      </div>
    );
  }
};

const MatcingCard = () => {
  /**以下テスト変数(pagesとの結合段階で使う) */
  //テスト用の賛否状態管理。(現在は親から受け取った情報を配列stateで管理する予定)
  const [testProsCons, setTestProsCons] = useState(true);
  //ディベートテーマ
  const [testTheme, setTestTheme] =
    useState("五条悟は両面宿儺より強いですか？");
  //相手ユーザーのアイコン
  const userIcon =
    "https://matitaka.dawn-waiting.com/static/media/IMG_2883.345fbe743ae2b250d435.jpg";
  /*---ここまで---*/

  //マッチングの状態
  const [matchState, setMatchState] = useState<MatchingState>(
    MatchingState.Waiting
  );

  //動作確認用
  useEffect(() => {
    const test = setTimeout(() => {
      setMatchState(MatchingState.Success);
    }, 3000);
    return () => clearTimeout(test);
  }, [matchState]);

  //はい、いいえボタンの挙動
  const handleYes = () => {};
  const handleNo = () => {
    //動作確認用
    setMatchState(MatchingState.Waiting);
  };

  return (
    <motion.div
      {...animationConfig}
      className="fixed top-0 left-0 z-[3] h-full w-full"
    >
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
              {matchState === MatchingState.Waiting && (
                <motion.div {...animationConfig}>
                  <Loading />
                </motion.div>
              )}
              {matchState === MatchingState.Success && (
                <motion.div {...animationConfig}>
                  <Avatar image={userIcon} size="xl" />
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
                    <p className="fofnt-medium">ディベート内容</p>
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
