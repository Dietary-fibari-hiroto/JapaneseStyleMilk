import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWebRTC } from "../webRtc/useWebRtc";
import { AudioRecorderService } from "../AudioRecoder/AudioRecoderService";
import { TranscriptionController } from "../TranscriptionService/TranscriptionController";
import { OpponentAccount } from "../../types";
import { socket } from "../webRtc/webrtc";  // ここで socket をインポート

type TurnPhase = "none" | "first-turn" | "cooldown-1" | "second-turn" | "cooldown-2" | "done";

export default function CallConnect() {
  const room = "a";

  // CallConnect 側で管理する状態
  const [currentRound, setCurrentRound] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>("none");
  const [self, setSelf] = useState<OpponentAccount | null>(null);
  const [opponent, setOpponent] = useState<OpponentAccount | null>(null);

  const recorderRef = useRef<AudioRecorderService | null>(null);
  const isStoppingRef = useRef(false);
  const transcriptionController = useRef(new TranscriptionController()).current;

  // useWebRTCから返ってくる値（setXXXは返さない）
  const {
    localVideoRef,
    remoteVideoRef,
    remoteStream,
    canCall,
    isConnected,
    handleCall,
    startRecording: webRTCStartRecording,
    stopRecording: webRTCStopRecording,
  } = useWebRTC(room, (account) => {
    setOpponent(account);
  });

  // 自分のアカウント情報を取得
  useEffect(() => {
    const selfData = localStorage.getItem("langbate_account");
    if (selfData) {
      try {
        setSelf(JSON.parse(selfData));
      } catch (e) {
        console.error("自分のアカウント情報の読み込みに失敗", e);
      }
    }
  }, []);

  // socket イベントの登録はここで行う
  useEffect(() => {
    const handleJoined = (data: { room: string; socketId: string; isHost: boolean }) => {
      setIsHost(data.isHost);
    };

    const handleConnect = () => {
      setSocketId(socket.id ?? null);
    };

    socket.on("joined", handleJoined);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("joined", handleJoined);
      socket.off("connect", handleConnect);
    };
  }, []);

    // 録音開始
  const startRecording = useCallback(() => {
    webRTCStartRecording();
    setIsRecording(true);
  }, [webRTCStartRecording]);

  //録音停止と文字起こし
  const stopRecording = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      const blob = await webRTCStopRecording();
      setIsRecording(false);

      if (!blob || blob.size === 0 || !self) return;

      setAudioURL(URL.createObjectURL(blob));

      const phaseNumber = isHost ? 1 : 2;
      const result = await transcriptionController.transcribe(
        phaseNumber,
        currentRound,
        String(self.id),
        blob
      );
      console.log("文字起こし:", result);
    } catch (e) {
      console.error("録音停止エラー", e);
    } finally {
      isStoppingRef.current = false;
    }
  }, [self, isHost, currentRound, webRTCStopRecording]);
    
  // 「turn phase」イベントはsocketを直接使う
  useEffect(() => {
    const handleTurn = ({ round, phase }: { round: number; phase: TurnPhase }) => {
      setCurrentRound(round);
      setTurnPhase(phase);

      const myTurn = (phase === "first-turn" && isHost) || (phase === "second-turn" && !isHost);
      setIsMyTurn(myTurn);

      if (myTurn) startRecording();
      else stopRecording();
    };

    socket.on("turn phase", handleTurn);
    return () => {
      socket.off("turn phase", handleTurn);
    };
  }, [isHost, self, startRecording, stopRecording]);

  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <div>
          <p>🌀 現在のラウンド: {currentRound}</p>
          <p>🎙️ フェーズ: {turnPhase}</p>
        </div>

        <button
          onClick={() => socket.emit("start round", room)}
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
            {self && <div style={{ marginTop: 10 }}>👤 あなた: {self.id}</div>}
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
