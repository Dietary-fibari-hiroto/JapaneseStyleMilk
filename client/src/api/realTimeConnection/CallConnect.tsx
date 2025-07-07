import React, { useEffect, useRef, useState } from "react";
import { socket, WebRTCConnection } from "./webrtcApi";
import { AudioRecorder } from "./AudioRecoder";

export default function CallConnect() {
  const room = "a"; // 通信ルーム名（固定）
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [canCall, setCanCall] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    webrtcRef.current = new WebRTCConnection(room);

    webrtcRef.current.initLocalStream().then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCanCall(true);
    });

    socket.on("knocked response", (numClients: number, room: string) => {
      if (numClients === 0) socket.emit("create", room);
      else if (numClients === 1) socket.emit("join", room);
    });

    socket.on("created", () => {
      if (
        webrtcRef.current &&
        !webrtcRef.current.isStarted &&
        webrtcRef.current.localStream
      ) {
        webrtcRef.current.createPeerConnection(setRemoteStream);
        webrtcRef.current.startConnection();
      }
    });

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

    socket.on(
      "offer",
      async (desc: RTCSessionDescriptionInit & { room: string }) => {
        if (!webrtcRef.current) return;

        const rtc = webrtcRef.current;

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
      }
    );

    socket.on(
      "answer",
      async (desc: RTCSessionDescriptionInit & { room: string }) => {
        if (!webrtcRef.current?.peerConnection) return;

        const pc = webrtcRef.current.peerConnection;

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(desc));
        }
      }
    );

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

    return () => {
      socket.off("knocked response");
      socket.off("created");
      socket.off("joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [room]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleCall = () => {
    socket.emit("knock", room);
  };

  // 録音開始
  const startRecording = () => {
    const stream = webrtcRef.current?.localStream;
    console.log("localStream audio tracks:", stream?.getAudioTracks());

    if (!stream || stream.getAudioTracks().length === 0) {
      console.error("録音できません。音声トラックがありません");
      return;
    }

    // 音声トラックだけを抽出したストリームを作成
    const audioStream = new MediaStream(stream.getAudioTracks());

    // MIMEタイプを選択
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

  // 録音停止
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
            muted
            playsInline
            style={{ width: "100%", height: "225px", backgroundColor: "black" }}
          />
          <div style={{ padding: "10px", textAlign: "center" }}>
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

            {audioURL && (
              <div style={{ marginTop: "10px" }}>
                <audio controls src={audioURL} />
              </div>
            )}
          </div>
        </div>

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
