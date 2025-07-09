import {
  handleCandidate,
  handleAnswer,
  handleCreatedOrJoined,
  handleOffer,
} from "./webRtc.service";
import { socket } from "../realTimeConnection/webrtcApi";
import { WebRTCConnection } from "../realTimeConnection/webrtcApi";

export const registerWebRTCHandlers = (
  rtc: WebRTCConnection,
  room: string,
  setRemoteStream: (s: MediaStream) => void,
  setIsConnected: (value: boolean) => void
) => {
  //サーバーからのknockの返事
  socket.on("knocked response", (numClients: number) => {
    if (numClients === 0) socket.emit("create", room);
    else if (numClients === 1) socket.emit("join", room);
  });

  //部屋を作るときの処理
  socket.on("created", () => {
    handleCreatedOrJoined(rtc, setRemoteStream, setIsConnected);
  });

  //参加時の処理
  socket.on("joined", () => {
    handleCreatedOrJoined(rtc, setRemoteStream, setIsConnected);
  });

  //相手からの「通話しよう」リクエストを受けたときの処理
  socket.on("offer", (desc: any) => {
    handleOffer(rtc, desc, room, setRemoteStream, setIsConnected);
  });
  socket.on("answer", (desc: any) => {
    handleAnswer(rtc, desc);
  });
  socket.on("candidate", (candidate: any) => {
    handleCandidate(rtc, candidate);
  });
};

export const unregisterWebRTCHandlers = () => {
  socket.off("knocked response");
  socket.off("created");
  socket.off("joined");
  socket.off("offer");
  socket.off("answer");
  socket.off("candidate");
};
