import React, { useEffect, useRef, useState, useCallback } from "react";
import { WebRTCConnection } from "../webRtc/webrtc";
import { registerWebRTCHandlers, unregisterWebRTCHandlers } from "../webRtc/webRtc.controller";
import { AudioRecorderService } from "../AudioRecoder/AudioRecoderService";
import { TranscriptionController } from "../TranscriptionService/TranscriptionController";
import { OpponentAccount } from "../../types";
import { socket } from "../webRtc/webrtc";

type TurnPhase =
  | "none"
  | "first-turn"
  | "cooldown-1"
  | "second-turn"
  | "cooldown-2"
  | "done";
  

export default function CallConnect() {
  const room = "a";

  const [currentRound, setCurrentRound] = useState(1);
  const [roundStatus, setRoundStatus] = useState<"waiting" | "started" | "ended">("waiting");
  const [isConnected, setIsConnected] = useState(false);
  const [isTalkAllowed, setIsTalkAllowed] = useState(false);

  const [self, setSelf] = useState<OpponentAccount | null>(null);
  const [opponent, setOpponent] = useState<OpponentAccount | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isHost, setIsHost] = useState<boolean>(false);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const recorderRef = useRef<AudioRecorderService | null>(null);
  const isStoppingRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const recordingRoundRef = useRef(1);
  const currentRoundRef = useRef(currentRound);

  const transcriptionController = useRef(new TranscriptionController()).current;
  const userIdStr = self?.id !== undefined ? String(self.id) : "unknown";
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>("none");

  const startRecording = useCallback(() => {
    const stream = webrtcRef.current?.localStream;
    if (!stream || stream.getAudioTracks().length === 0) return;
    const audioStream = new MediaStream(stream.getAudioTracks());
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";

    if (!mimeType) return;

    recorderRef.current = new AudioRecorderService(audioStream, mimeType);
    try {
      recorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("録音開始エラー", e);
    }
  }, []);

const stopRecording = useCallback(async () => {
  if (isStoppingRef.current) return;
  isStoppingRef.current = true;

  try {
    if (recorderRef.current?.isRecording()) {
      const blob = await recorderRef.current.stop();
      setIsRecording(false);

      if (blob.size === 0) return;

      setAudioURL(URL.createObjectURL(blob));

      const sequenceInTurn =
        turnPhase === "first-turn" ? 1 :
        turnPhase === "second-turn" ? 2 : 0;

      const userIdStr = self?.id !== undefined ? String(self.id) : "unknown";
      console.log(userIdStr);
      // 🔥 文字起こし & 評価をまとめて行う
      const result = await transcriptionController.transcribeAndEvaluate(
        blob,
        userIdStr,
        recordingRoundRef.current,
        sequenceInTurn
      );

      console.log("📄 文字起こし & 評価結果:", result);
    }
  } catch (e) {
    console.error("録音停止エラー", e);
  } finally {
    isStoppingRef.current = false;
  }
}, [socketId, turnPhase, self]);


  useEffect(() => {
    const selfData = localStorage.getItem("langbate_account");
    if (selfData) {
      try {
        const parsed: OpponentAccount = JSON.parse(selfData);
        setSelf(parsed);
      } catch (e) {
        console.error("自分のアカウント情報の読み込みに失敗", e);
      }
    }
  }, []);

useEffect(() => {
  socket.on("joined", (data) => {

  const { room, socketId, isHost } = data;
    console.log("joined data 受信:", data);
    setIsHost(isHost);
    console.log("room", room);
    console.log("socket", socketId);
    console.log("自分はホストか？", isHost);
  });


  return () => {
    socket.off("joined");
  };
}, []);



useEffect(() => {
  socket.on("turn phase", ({ round, phase }: { round: number; phase: TurnPhase }) => {
    setCurrentRound(round);
    setTurnPhase(phase);

    // ホストは first-turn のターン、非ホストは second-turn のターン
    const isMyTurn =
      (phase === "first-turn" && isHost) ||
      (phase === "second-turn" && !isHost);

    setIsMyTurn(isMyTurn);

    if (isMyTurn) {
      startRecording();
    } else {
      stopRecording();
    }

    console.log(`🎮 Phase: ${phase} / MyTurn: ${isMyTurn}`);
  });

  return () => {
    socket.off("turn phase");
  };
}, [isHost]);


  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

const handleCall = async () => {
  socket.emit("knock", room);

  webrtcRef.current = new WebRTCConnection(room);
  await webrtcRef.current.initLocalStream();

  const stream = webrtcRef.current.localStream;
  if (stream && localVideoRef.current) {
    localVideoRef.current.srcObject = stream;

    // 通話が始まるまではマイクを無効化
    stream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }

  // ハンドラー登録
  registerWebRTCHandlers(
    webrtcRef.current,
    room,
    setRemoteStream,
    setIsConnected,
    setOpponent
  );
};


  useEffect(()=>{
    const stream = webrtcRef.current?.localStream;
    if(!stream)return;

    stream.getAudioTracks().forEach((track) => {
        track.enabled = isMyTurn; // ← 自分のターン中だけマイクON
    });
  },[isMyTurn])


  useEffect(() => {
      socket.on("turn phase", ({ round, phase }: { round: number; phase: TurnPhase }) => {
      setCurrentRound(round);
      setTurnPhase(phase);
    });
    return () => {
      socket.off("turn phase");
    };
  }, [] );


  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <div>
      <p>🌀 現在のラウンド: {currentRound}</p>
      <p>🎙️ フェーズ: {turnPhase}</p>
    </div>
        <button
          onClick={() => socket.emit("start round", room)}  //ラウンドを開始する処理

          style={{
            padding: "10px 20px",
            backgroundColor: "#f57c00",
            color: "white",
            border: "none",
            borderRadius: 4,
            marginBottom: 12,
            marginLeft: 12,
          }}
        >
          START ROUND
        </button>

        <div style={{ width: 400, border: "1px solid #ccc", borderRadius: 8 }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "100%", height: 225, backgroundColor: "black" }}
          />
          <div style={{ padding: 10, textAlign: "center" }}>
            <button
              onClick={handleCall}
              disabled={isConnected}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: isConnected ? "not-allowed" : "pointer",
                marginBottom: 12,
              }}
            >
              CALL
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isConnected}
              style={{
                padding: "10px 20px",
                backgroundColor: isRecording ? "#d32f2f" : "#388e3c",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: isConnected ? "pointer" : "not-allowed",
              }}
            >
              {isRecording ? "STOP RECORDING" : "START RECORDING"}
            </button>

            {audioURL && <audio controls src={audioURL} style={{ marginTop: 10 }} />}
            {opponent && <div style={{ marginTop: 10 }}>相手: {opponent.id}</div>}
            {self && (
              <div style={{ marginTop: 10 }}>
                👤 あなた: {self.id}
              </div>
            )}
          </div>
        </div>

        <div style={{ width: 400, border: "1px solid #ccc", borderRadius: 8 }}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: 225, backgroundColor: "black" }}
          />
        </div>
      </div>
    </div>
  );
}
