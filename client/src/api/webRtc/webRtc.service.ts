import { WebRTCConnection } from "./webrtc";
import { socket } from "./webrtc";

// WebRTCインスタンスの初期化
export const initWebRTC = async (
  room: string,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  setCanCall: (b: boolean) => void
): Promise<WebRTCConnection> => {
  const rtc = new WebRTCConnection(room);
  const stream = await rtc.initLocalStream();
  if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  setCanCall(true);
  return rtc;
};

// 部屋作成、または参加時に呼び出される（接続準備）
export const handleCreatedOrJoined = (
  rtc: WebRTCConnection,
  setRemoteStream: (s: MediaStream) => void,
  setIsConnected: (value: boolean) => void
) => {
  if (!rtc.isStarted && rtc.localStream) {
    rtc.createPeerConnection(setRemoteStream, () => {
      setIsConnected(true);
    });
    rtc.startConnection();
  }
};

// 相手からの"通話しよう"リクエスト（offer）を受けたときの処理
export const handleOffer = async (
  rtc: WebRTCConnection,
  desc: RTCSessionDescriptionInit,
  room: string,
  setRemoteStream: (s: MediaStream) => void,
  setIsConnected: (value: boolean) => void
) => {
  if (!rtc.peerConnection && rtc.localStream) {
    rtc.createPeerConnection(setRemoteStream, () => {
      setIsConnected(true);
    });
  }
  if (!rtc.peerConnection) return;

  await rtc.peerConnection.setRemoteDescription(
    new RTCSessionDescription(desc)
  );
  const answer = await rtc.peerConnection.createAnswer();
  await rtc.peerConnection.setLocalDescription(answer);

  rtc.isStarted = true;
  socket.emit("answer", {
    ...rtc.peerConnection.localDescription!.toJSON(),
    room,
  });
};

// 相手が通話リクエストを了承（answer）したときの処理
export const handleAnswer = async (
  rtc: WebRTCConnection,
  desc: RTCSessionDescriptionInit
) => {
  if (!rtc.peerConnection) return;
  if (rtc.peerConnection.signalingState === "have-local-offer") {
    await rtc.peerConnection.setRemoteDescription(
      new RTCSessionDescription(desc)
    );
  }
};

// ICE Candidate（経路情報）の受信時に処理
export const handleCandidate = async (
  rtc: WebRTCConnection,
  candidate: RTCIceCandidateInit
) => {
  if (!rtc.peerConnection) return;
  try {
    await rtc.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error("ICE Candidate処理エラー:", error, candidate);
  }
};
