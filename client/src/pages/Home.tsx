import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { VersusAvatars, MatchingCard } from "../components";
import PrimaryButton from "../components/common/PrimaryButton";
import { getMe } from "../api/auth";
import { useAccount } from "../contexts/AccountContext";

const Home = () => {
  const { account, setIsFetching } = useAccount();

  const [openMatchingCard, setOpenMatchingCard] = useState(false);
  return (
    <div className="w-[80%]">
      <AnimatePresence mode="wait">
        {openMatchingCard && <MatchingCard />}
      </AnimatePresence>
      <div className="w-full h-full flex flex-col space-y-[50px]">
        <div className="text-start">
          <p className="text-header-l font-bold text-[--text-header_primary]">
            こんにちは{account?.name}さん
          </p>
          <p className="text-header-l font-bold text-[--text-header_secondary]">
            今日もディベートやる？
          </p>
        </div>
        <VersusAvatars img_url={`${account?.img_url}`} />
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
    </div>
  );
};

export default Home;
