import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { VersusAvatars, MatchingCard } from "../components";
import PrimaryButton from "../components/common/PrimaryButton";

const Home = () => {
  const [openMatchingCard, setOpenMatchingCard] = useState(false);
  return (
    // <div className="w-[100vw] h-screen flex justify-center items-center text-[100px]">
    //   和風牛乳
    // </div>
    <>
      <AnimatePresence mode="wait">
        {openMatchingCard && <MatchingCard />}
      </AnimatePresence>
      <div className="w-full h-full flex flex-col space-y-[50px]">
        <div className="text-start">
          <p className="text-header-l font-bold text-[--text-header_primary]">
            こんにちは山田さん
          </p>
          <p className="text-header-l font-bold text-[--text-header_secondary]">
            今日もディベートやる？
          </p>
        </div>
        <VersusAvatars />
        <div className="flex-all-center">
          {" "}
          <PrimaryButton
            size="Large"
            color="Main"
            shape="Round"
            label="ディベート開始"
            onClick={() => {
              setOpenMatchingCard(true);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
