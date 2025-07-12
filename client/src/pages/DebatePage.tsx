import { useEffect, useRef } from "react";
import { DebateButton, VersusAvatars } from "../components";
import SectionHeader from "../components/common/SectionHeader";
import { useWebRTCStore } from "../store/webrtcStore";
const DebatePage = () => {
  const { webrtc, remoteStream } = useWebRTCStore();
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream || null;
    }
  }, [remoteStream]);

  return (
    <div className="w-[80%] flex-all-center">
      {" "}
      <audio ref={remoteVideoRef} autoPlay />
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
    </div>
  );
};

export default DebatePage;
