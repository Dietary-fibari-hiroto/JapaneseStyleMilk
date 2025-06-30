import { DebateButton, VersusAvatars } from "../components";
import SectionHeader from "../components/common/SectionHeader";

const DevatePage = () => {
  return (
    <>
      <div className="space-y-[50px]">
        {/* ページ見出し(ラウンド) */}
        <SectionHeader mode="anime" />

        {/* 自分と対戦相手のアバター */}
        <VersusAvatars />

        {/* ディベート状態表示・変更ボタン */}
        <DebateButton />

      </div>
    </>
    
  );
};

export default DevatePage;