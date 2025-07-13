// Reactのフックなどをインポート
import React, { useEffect, useRef, useState } from "react";
// WebRTCとSocket.io関連のAPIをインポート
import { socket, WebRTCConnection } from "../webRtc/webrtcApi";
// 音声録音用クラスをインポート
import { AudioRecorderService } from "../AudioRecoder/AudioRecoderService";

import {VoiceActivityMonitorService} from "../VoiceActivityMonitor/VoiceActivityMonitor"



// コンポーネント定義
export default function CallConnect() {
  const room = "a"; // 固定ルーム名（この部屋で通話）

  const vad = useRef<VoiceActivityMonitorService | null>(null);


  // 自分の映像を表示するvideo要素の参照
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  // 相手の映像を表示するvideo要素の参照
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // 相手のメディアストリームを保存するステート
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // CALLボタンが押せるかどうかの状態
  const [canCall, setCanCall] = useState(false);

  // 録音中かどうか
  const [isRecording, setIsRecording] = useState(false);
  // 録音した音声のURL
  const [audioURL, setAudioURL] = useState<string | null>(null);

  // WebRTCの接続インスタンス
  const webrtcRef = useRef<WebRTCConnection | null>(null);
  // 音声録音インスタンス
  const recorderRef = useRef<AudioRecorderService | null>(null);

  // 初回レンダー時のセットアップ
  useEffect(() => {
    // WebRTCConnectionのインスタンスを生成
    webrtcRef.current = new WebRTCConnection(room);

    // ローカル映像の取得
    webrtcRef.current.initLocalStream().then((stream) => {
      // 映像をvideoタグに表示
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCanCall(true); // CALLボタンを有効にする
    });

    // サーバーに「部屋の人数」を問い合わせた結果を受け取る
    socket.on("knocked response", (numClients: number, room: string) => {
      if (numClients === 0)
        socket.emit("create", room); // 誰もいないなら部屋作成
      else if (numClients === 1) socket.emit("join", room); // 誰かいれば参加
    });

    // 自分が部屋作成者（ホスト）の場合
    socket.on("created", () => {
      if (
        webrtcRef.current &&
        !webrtcRef.current.isStarted &&
        webrtcRef.current.localStream
      ) {
        // ピア接続を作成して開始
        webrtcRef.current.createPeerConnection(setRemoteStream);
        webrtcRef.current.startConnection();
      }
    });

    // 自分が部屋参加者（ゲスト）の場合
    socket.on("joined", () => {
      if (
        webrtcRef.current &&
        !webrtcRef.current.isStarted &&
        webrtcRef.current.localStream
      ) {
        webrtcRef.current.createPeerConnection(setRemoteStream);
        webrtcRef.current.startConnection();
      }
    });

    // offer を受信したとき
    socket.on(
      "offer",
      async (desc: RTCSessionDescriptionInit & { room: string }) => {
        if (!webrtcRef.current) return;

        const rtc = webrtcRef.current;

        // まだ接続が確立していない場合に作成
        if (!rtc.peerConnection && rtc.localStream) {
          rtc.createPeerConnection(setRemoteStream);
        }

        if (!rtc.peerConnection) return;

        // offerを相手のSDPとしてセット
        await rtc.peerConnection.setRemoteDescription(
          new RTCSessionDescription(desc)
        );

        // answerを作成して送信
        const answer = await rtc.peerConnection.createAnswer();
        await rtc.peerConnection.setLocalDescription(answer);

        rtc.isStarted = true;

        socket.emit("answer", {
          ...rtc.peerConnection.localDescription!.toJSON(),
          room,
        });
      }
    );

    // answer を受信したとき
    socket.on(
      "answer",
      async (desc: RTCSessionDescriptionInit & { room: string }) => {
        if (!webrtcRef.current?.peerConnection) return;

        const pc = webrtcRef.current.peerConnection;

        // offerを送っている状態であれば、answerを適用
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(desc));
        }
      }
    );

    // ICE candidate を受信したとき
    socket.on(
      "candidate",
      async (candidate: RTCIceCandidateInit & { room: string }) => {
        if (!webrtcRef.current?.peerConnection) return;

        try {
          await webrtcRef.current.peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (e) {
          console.error("addIceCandidate error:", e, candidate);
        }
      }
    );

    // クリーンアップ
    return () => {
      socket.off("knocked response");
      socket.off("created");
      socket.off("joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [room]);

  // 相手のストリームをvideoタグにセット
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // 通話を開始するボタン押下時の処理
  const handleCall = () => {
    socket.emit("knock", room); // サーバーに部屋の人数確認リクエスト
  };
  
useEffect(() => {
  if (!webrtcRef.current?.localStream) return;

  const stream = webrtcRef.current.localStream;
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
    ? "audio/webm"
    : "";

  const audioStream = new MediaStream(stream.getAudioTracks());
  recorderRef.current = new AudioRecorderService(audioStream, mimeType);

  vad.current = new VoiceActivityMonitorService(stream, recorderRef.current);

  // イベントを設定
  vad.current.onVoiceStart = () => {
    console.log("話し始めた");
    if (!isRecording) startRecording();
  };

  vad.current.onVoiceStop = () => {
    console.log("話し終わった");
    if (isRecording) stopRecording();
  };

  vad.current.onVoiceStart(); // VADの監視を開始

  return () => {
    vad.current?.onVoiceStop?.(); // クリーンアップ
  };
}, ); // 通話開始可能になったタイミングで実行
  // 録音を開始
  const startRecording = () => {
    const stream = webrtcRef.current?.localStream;
    console.log("localStream audio tracks:", stream?.getAudioTracks());

    if (!stream || stream.getAudioTracks().length === 0) {
      console.error("録音できません。音声トラックがありません");
      return;
    }

    // 音声トラックだけを取り出した MediaStream を作る
    const audioStream = new MediaStream(stream.getAudioTracks());

    // サポートされているMIMEタイプを選ぶ
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";

    if (!mimeType) {
      console.error("録音できるMIMEタイプがありません");
      return;
    }

    // 録音インスタンスを作成し、録音開始
    recorderRef.current = new AudioRecorderService(audioStream, mimeType);

    try {
      recorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("録音開始エラー", e);
    }
  };

  // 録音を停止して再生用のURLを取得
  const isStoppingRef = useRef(false); //重複して停止を実行しないため

  const stopRecording = async () => {
    if (isStoppingRef.current) {
      console.warn("stopRecording: すでに録音停止処理中です");
      return;
    }

    isStoppingRef.current = true;
    try {
      if (recorderRef.current?.isRecording()) {
            const blob = await recorderRef.current.stop();
              console.log("録音データサイズ:", blob.size);
            if (blob.size === 0) {
              console.warn("録音データサイズが0のため送信をスキップします");
              setIsRecording(false);
              isStoppingRef.current = false;
              return;
            }
            const formData = new FormData();
            formData.append("audio", blob, "audio.webm");

            const response = await fetch("http://192.168.40.200:5000/transcribe", {
              method: "POST",
              body: formData,
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              console.log("文字起こし結果:", data.text);
            } else {
              const text = await response.text();
              console.error("Unexpected response:", text);
            }
      }
    } catch (err) {
      console.error("録音停止エラー", err);
    } finally {
      isStoppingRef.current = false;
    }
  };


  // JSXのUI描画
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {/* 自分の映像表示 + ボタン群 */}
        <div
          style={{
            width: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted // 自分の声がループしないようにミュート
            playsInline
            style={{ width: "100%", height: "225px", backgroundColor: "black" }}
          />
          <div style={{ padding: "10px", textAlign: "center" }}>
            {/* 通話開始ボタン */}
            <button
              onClick={handleCall}
              disabled={!canCall}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: canCall ? "pointer" : "not-allowed",
                marginBottom: "12px",
              }}
            >
              CALL
            </button>

            {/* 録音開始・停止ボタン */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!canCall}
              style={{
                padding: "10px 20px",
                backgroundColor: isRecording ? "#d32f2f" : "#388e3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: canCall ? "pointer" : "not-allowed",
              }}
            >
              {isRecording ? "STOP" : "START RECORDING"}
            </button>

            {/* 録音した音声を再生 */}
            {audioURL && (
              <div style={{ marginTop: "10px" }}>
                <audio controls src={audioURL} />
              </div>
            )}
          </div>
        </div>

        {/* 相手の映像表示 */}
        <div
          style={{
            width: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "225px", backgroundColor: "black" }}
          />
        </div>
      </div>
    </div>
  );
}
