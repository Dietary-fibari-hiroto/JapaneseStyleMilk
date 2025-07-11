import {
  handleCandidate,
  handleAnswer,
  handleCreatedOrJoined,
  handleOffer,
} from "./webRtc.service";
import { socket } from "./webrtcApi";
import { WebRTCConnection } from "./webrtcApi";
import { OpponentAccount } from "../../types";

export const registerWebRTCHandlers = (
  rtc: WebRTCConnection,
  room: string,
  setRemoteStream: (s: MediaStream) => void,
  setIsConnected: (value: boolean) => void,
  setOpponent: (account: OpponentAccount) => void
) => {
  const getId = localStorage.getItem("accountId");
  const accountId = Number(getId);
  //サーバーからのknockの返事
  socket.on("knocked response", (numClients: number) => {
    console.log(accountId, ":を送ったお");
    if (numClients === 0) socket.emit("create", room, accountId);
    else if (numClients === 1) socket.emit("join", room, accountId);
  });

  //部屋を作るときの処理
  socket.on("created", () => {
    handleCreatedOrJoined(rtc, setRemoteStream, setIsConnected);
  });

  //参加時の処理
  socket.on("joined", () => {
    handleCreatedOrJoined(rtc, setRemoteStream, setIsConnected);
  });
  //アカウントIDを送信しあうポイント
  socket.on("peer-joined", (socketId: string, accountId: number) => {
    console.log(socketId, accountId);
    /**
     * 以下にAPIリクエスト及びcontext格納処理を格納
     */
    setOpponent({
      id: 1,
      name: "test",
      img_url: "https",
    });
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
  socket.off("peer-joined");
  socket.off("offer");
  socket.off("answer");
  socket.off("candidate");
};
