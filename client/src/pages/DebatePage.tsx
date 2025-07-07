import { DebateButton, VersusAvatars } from "../components";
import SectionHeader from "../components/common/SectionHeader";

const DebatePage = () => {
  return (
    <>
      <div className="space-y-[50px]">
        {/* ページ見出し(ラウンド) */}
        <SectionHeader mode="anime" />

        {/* 自分と対戦相手のアバター */}
        <VersusAvatars img_url="gray.jpg" />

        {/* ディベート状態表示・変更ボタン */}
        <div className="flex-all-center">
          <DebateButton />
        </div>
      </div>
    </>
  );
};

export default DebatePage;
