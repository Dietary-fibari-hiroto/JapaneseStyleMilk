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
  const [opponent, setOpponent] = useState<OpponentAccount | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const recorderRef = useRef<AudioRecorderService | null>(null);
  const isStoppingRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const recordingRoundRef = useRef(1);
  const currentRoundRef = useRef(currentRound);

  const transcriptionController = useRef(new TranscriptionController()).current;

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

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
        const result = await transcriptionController.transcribe(
          blob,
          socketId ?? "unknown",
          recordingRoundRef.current
        );
        console.log("文字起こし結果:", result);
      }
    } catch (e) {
      console.error("録音停止エラー", e);
    } finally {
      isStoppingRef.current = false;
    }
  }, [socketId]);

  useEffect(() => {
    webrtcRef.current = new WebRTCConnection(room);
    webrtcRef.current.initLocalStream().then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    });

    registerWebRTCHandlers(
      webrtcRef.current,
      room,
      setRemoteStream,
      setIsConnected,
      setOpponent
    );

    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
    });

    return () => {
      unregisterWebRTCHandlers();
      socket.off("connect");
      webrtcRef.current?.localStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleCall = () => {
    socket.emit("knock", room);
    webrtcRef.current = new WebRTCConnection(room);

    registerWebRTCHandlers(
      webrtcRef.current,
      room,
      setRemoteStream,
      setIsConnected,
      setOpponent
    );
  };
        const [turnPhase, setTurnPhase] = useState<TurnPhase>("none");

  useEffect(() => {
    socket.on("round updated", ({ round }) => {
      setCurrentRound(round);
      setRoundStatus("waiting");
    });

    socket.on("round started", ({ round }) => {
      setCurrentRound(round);
      currentRoundRef.current = round;
      recordingRoundRef.current = round;
      setRoundStatus("started");
    });

    socket.on("round ended", ({ round }) => {
      setRoundStatus("ended");
      console.log(`Round ${round} ended`);
    });
      socket.on("turn phase", ({ round, phase }: { round: number; phase: TurnPhase }) => {
      setCurrentRound(round);
      setTurnPhase(phase);
      console.log(`🎮 Phase update: Round ${round}, Phase ${phase}`);
    });
    return () => {
      socket.off("round updated");
      socket.off("round started");
      socket.off("round ended");
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
          disabled={!isConnected}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f57c00",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
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
            {opponent && <div style={{ marginTop: 10 }}>相手: {opponent.name}</div>}
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
