import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate, MotionConfig } from "framer-motion";
import clsx from "clsx";
import Loading from "../common/Loading";
import Avatar from "../common/Avatar";
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
      <div className="w-[60px] h-[38px] bg-[--surface-debate_position_tag] text-[--text-debate-position_text]"></div>
    );
  } else {
    return (
      <div className="w-[60px] h-[38px] bg-[--text-debate-position_text] text-[--surface-debate_position_tag]"></div>
    );
  }
};

const MatcingCard = () => {
  //テスト用の賛否状態管理。(現在は親から受け取った情報を配列stateで管理する予定)
  const [testProsCons, setTestProsCons] = useState(false);
  const [matchState, setMatchState] = useState<MatchingState>(
    MatchingState.Success
  );

  return (
    <div className="w-[780px] min-h-[540px] py-[16px] px-[56px] bg-[--surface-matching_card_frame] rounded-[32px] space-y-[28px]">
      <div className={clsx(contentStyle, "")}>
        <p className="text-header-r text-[#FAFAFA] font-bold">ディベート相手</p>
        <div className="w-[668px] h-[280px] bg-[--surface-opponent_matching_card] rounded-[16px] flex-all-center">
          <AnimatePresence mode="wait">
            {matchState === MatchingState.Waiting && (
              <motion.div {...animationConfig}>
                <Loading />
              </motion.div>
            )}
            {matchState === MatchingState.Success && (
              <motion.div {...animationConfig}>
                <Avatar
                  image="https://matitaka.dawn-waiting.com/static/media/IMG_2883.345fbe743ae2b250d435.jpg"
                  size="xl"
                />
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
        <p className="text-header-r text-[#FAFAFA] font-bold">ディベート内容</p>
        <div className="w-[668px] h-[52px] bg-[--surface-opponent_matching_card] rounded-[16px] flex-all-center">
          <AnimatePresence mode="wait">
            {matchState === MatchingState.Waiting && (
              <motion.div {...animationConfig}>
                <Loading miniMode={true} />
              </motion.div>
            )}
            {matchState === MatchingState.Success && (
              <motion.div {...animationConfig}>
                <div className="flex items-center space-x-[5px]">
                  <p>ディベート内容</p>
                  <ProsCons witch={testProsCons} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className={clsx(contentStyle, "")}></div>
    </div>
  );
};

export default MatcingCard;
