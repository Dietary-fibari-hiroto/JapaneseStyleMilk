import React, { useEffect, useRef, useState } from "react";
import { socket, WebRTCConnection } from "./webrtcApi";

export default function CallConnect() {
  const room = "a";
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [canCall, setCanCall] = useState(false);

  const webrtcRef = React.useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    webrtcRef.current = new WebRTCConnection(room);

    webrtcRef.current.initLocalStream().then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCanCall(true);

      socket.emit("knock", room);
    });

    socket.on("knocked response", (numClients: number, room: string) => {
      if (numClients === 0) socket.emit("create", room);
      else if (numClients === 1) socket.emit("join", room);
    });

    socket.on("created", () => {
      if (webrtcRef.current && !webrtcRef.current.isStarted && webrtcRef.current.localStream) {
        webrtcRef.current.createPeerConnection(setRemoteStream);
        webrtcRef.current.startConnection();
      }
    });

    socket.on("joined", () => {
      if (webrtcRef.current && !webrtcRef.current.isStarted && webrtcRef.current.localStream) {
        webrtcRef.current.createPeerConnection(setRemoteStream);
        webrtcRef.current.startConnection();
      }
    });

    socket.on("offer", async (desc: RTCSessionDescriptionInit & { room: string }) => {
      if (!webrtcRef.current) return;

      const rtc = webrtcRef.current;

      if (!rtc.peerConnection && rtc.localStream) {
        rtc.createPeerConnection(setRemoteStream);
      }

      if (!rtc.peerConnection) return;

      console.log("Received offer, setting remote description");
      await rtc.peerConnection.setRemoteDescription(new RTCSessionDescription(desc));

      console.log("Creating answer...");
      const answer = await rtc.peerConnection.createAnswer();
      await rtc.peerConnection.setLocalDescription(answer);

      rtc.isStarted = true;

      console.log("Sending answer...");
      socket.emit("answer", { ...rtc.peerConnection.localDescription!.toJSON(), room });
    });

    socket.on("answer", async (desc: RTCSessionDescriptionInit & { room: string }) => {
      if (!webrtcRef.current?.peerConnection) return;

      const pc = webrtcRef.current.peerConnection;

      if (pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(desc));
      } else {
        console.warn("Ignoring answer because signalingState is", pc.signalingState);
      }
    });

    socket.on("candidate", async (candidate: RTCIceCandidateInit & { room: string }) => {
      if (!webrtcRef.current?.peerConnection) return;

      try {
        await webrtcRef.current.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("addIceCandidate error:", e, candidate);
      }
    });

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
        <div style={{ width: "400px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
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
              }}
            >
              CALL
            </button>
          </div>
        </div>

        <div style={{ width: "400px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
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
