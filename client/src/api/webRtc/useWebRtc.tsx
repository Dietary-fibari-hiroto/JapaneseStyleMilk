import { useEffect, useRef, useState } from "react";
import { initWebRTC } from "./webRtc.service";
import {
  registerWebRTCHandlers,
  unregisterWebRTCHandlers,
} from "./webRtc.controller";
import { WebRTCConnection } from "../realTimeConnection/webrtcApi";
import { AudioRecorder } from "../realTimeConnection/AudioRecoder";
import { socket } from "../realTimeConnection/webrtcApi";

export const useWebRTC = (room: string) => {
  //ビデオ系統の状態
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  //マイクやカメラの状態管理
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  //通話初期化完了か否か
  const [canCall, setCanCall] = useState(false);
  //接続状態(ここがtrueなら話せている状態)
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState(false);
  //録音データを管理するURl
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  //socketをリアルタイム管理＆実行&クリーンアップし続ける関数
  useEffect(() => {
    initWebRTC(room, localVideoRef, setCanCall).then((rtc) => {
      webrtcRef.current = rtc;
      registerWebRTCHandlers(rtc, room, setRemoteStream, setIsConnected);
    });
    return () => {
      unregisterWebRTCHandlers();
    };
  }, [room]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  //Callボタンの呼び出し
  const handleCall = () => {
    socket.emit("knock", room);
  };

  const startRecording = () => {
    const stream = webrtcRef.current?.localStream;
    if (!stream || stream.getAudioTracks().length === 0) {
      console.error("録音できません。音声トラックがありません");
      return;
    }
    const audioStream = new MediaStream(stream.getAudioTracks());
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
    if (!mimeType) {
      console.error("録音できるMIMEタイプがありません");
      return;
    }
    recorderRef.current = new AudioRecorder(audioStream, mimeType);
    try {
      recorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("録音開始エラー", e);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      const audioBlob = await recorderRef.current.stop();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setIsRecording(false);
    } catch (e) {
      console.error("録音停止エラー", e);
    }
  };

  return {
    localVideoRef,
    remoteVideoRef,
    remoteStream,
    canCall,
    isRecording,
    audioURL,
    isConnected,
    handleCall,
    startRecording,
    stopRecording,
  };
};
