import { WebRTCConnection } from "../realTimeConnection/webrtcApi";
import { socket } from "../realTimeConnection/webrtcApi";

//WebRTCインスタンスの初期化
export const initWebRTC = async (
  room: string,
  localVideoRef: React.RefObject<HTMLVideoElement>,
  setCanCall: (b: boolean) => void
): Promise<WebRTCConnection> => {
  const rtc = new WebRTCConnection(room);
  const stream = await rtc.initLocalStream();
  if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  setCanCall(true);
  return rtc;
};

//部屋作成、または参加イベント
export const handleCreatedOrJoined = (
  rtc: WebRTCConnection,
  setRemoteStream: (s: MediaStream) => void
) => {
  /*
  カメラとマイクの確認が取れたときと、接続の開始フラグが立った時
    部屋の作成準備を進めるとともに接続を開始する
     */
  if (!rtc.isStarted && rtc.localStream) {
    rtc.createPeerConnection(setRemoteStream);
    rtc.startConnection();
  }
};

//相手からの「通話しよう」リクエストを受けたときの処理
export const handleOffer = async (
  rtc: WebRTCConnection,
  desc: RTCSessionDescriptionInit,
  room: string,
  setRemoteStream: (s: MediaStream) => void
) => {
  if (!rtc.peerConnection && rtc.localStream) {
    rtc.createPeerConnection(setRemoteStream);
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

//相手が通話リクエストを了承してくれたとき
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

//実際にどうやって通信するか（経路）を決める
export const handleCandidate = async (
  rtc: WebRTCConnection,
  candidate: RTCIceCandidateInit
) => {
  if (!rtc.peerConnection) return;
  try {
    await rtc.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.log("経路決定エラー:", error, candidate);
  }
};
