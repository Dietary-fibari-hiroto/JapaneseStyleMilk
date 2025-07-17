import { useEffect, useRef, useState, useCallback } from "react";
import { initWebRTC } from "./webRtc.service";
import {
  registerWebRTCHandlers,
  unregisterWebRTCHandlers,
} from "./webRtc.controller";
import { WebRTCConnection, socket } from "./webrtc";
import { AudioRecorderService } from "../AudioRecoder/AudioRecoderService";
import { TranscriptionController } from "../TranscriptionService/TranscriptionController";
import { OpponentAccount } from "../../types";

type TurnPhase = "none" | "first-turn" | "cooldown-1" | "second-turn" | "cooldown-2" | "done";

export const useWebRTC = (room: string) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const recorderRef = useRef<AudioRecorderService | null>(null);
  const transcriptionController = useRef(new TranscriptionController()).current;
  const isStoppingRef = useRef(false);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [canCall, setCanCall] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [socketId, setSocketId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [self, setSelf] = useState<OpponentAccount | null>(null);
  const [opponent, setOpponent] = useState<OpponentAccount | null>(null);

  const [turnPhase, setTurnPhase] = useState<TurnPhase>("none");
  const [currentRound, setCurrentRound] = useState(1);
  const [isMyTurn, setIsMyTurn] = useState(false);
const recordingRoundRef = useRef<number>(1);  // 例: useRefでnumber型のrefを作成

  // 初期アカウントの読み込み
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

  useEffect(() => {
    const handleOpponentInfo = (opponentData: OpponentAccount) => {
      setOpponent(opponentData);
    };

    socket.on("opponent-info", handleOpponentInfo);

    return () => {
      socket.off("opponent-info", handleOpponentInfo);
    };
  }, []);

  // WebRTC 初期化とイベント登録
  useEffect(() => {
    initWebRTC(room, localVideoRef, setCanCall).then((rtc) => {
      webrtcRef.current = rtc;
      registerWebRTCHandlers(rtc, room, setRemoteStream, setIsConnected, setOpponent);
    });

    return () => unregisterWebRTCHandlers();
  }, [room]);

  // リモートストリームを video に設定
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ソケットイベント登録
  useEffect(() => {
    const handleJoined = ({ isHost }: { room: string; socketId: string; isHost: boolean }) => {
      setIsHost(isHost);
    };

    const handleConnect = () => {
      setSocketId(socket.id ?? null);
    };

    const handleTurnPhase = async ({ round, phase }: { round: number; phase: TurnPhase }) => {
    setCurrentRound(round);
    setTurnPhase(phase);

    const myTurn = (phase === "first-turn" && isHost) || (phase === "second-turn" && !isHost);
    setIsMyTurn(myTurn);

    if (myTurn) {
      recordingRoundRef.current = isHost ? 1 : 2;  // ← 🔧 sequence_in_turn を設定
      startRecording();
    } else {
      await stopRecording();
    }
  };


    socket.on("joined", handleJoined);
    socket.on("connect", handleConnect);
    socket.on("turn phase", handleTurnPhase);

    return () => {
      socket.off("joined", handleJoined);
      socket.off("connect", handleConnect);
      socket.off("turn phase", handleTurnPhase);
    };
  }, [isHost, self]);

  const handleCall = () => socket.emit("knock", room);
  const startRound = () => socket.emit("start round", room);

  const startRecording = useCallback(() => {
    console.log("startRecording() called");

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
        console.log("🛑 stopRecording() called");
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (recorderRef.current?.isRecording()) {
        const blob = await recorderRef.current.stop();
        setIsRecording(false);
        if (!self) return;
        if (blob.size === 0) return;

        setAudioURL(URL.createObjectURL(blob));
        const result = await transcriptionController.transcribe(
            recordingRoundRef.current,  // sequence_in_turn
            currentRound,               // turn_number
            self.id  ?? "unknown",      // user_id
            blob                       // Blob
        );
        console.log("文字起こし結果:", result);
      }
    } catch (e) {
      console.error("録音停止エラー", e);
    } finally {
      isStoppingRef.current = false;
    }
  }, [socketId]);

  return {
    localVideoRef,
    remoteVideoRef,
    audioURL,
    canCall,
    isConnected,
    isRecording,
    isMyTurn,
    turnPhase,
    currentRound,
    handleCall,
    startRound,
    self,
    opponent,
  };
};
