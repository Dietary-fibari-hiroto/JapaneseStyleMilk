// CallConnect.tsx
import React from "react";
import { useWebRTC } from "../WebRtcTest/useWebRtc";

export default function CallConnect() {
  const room = "a";

  const {
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
  } = useWebRTC(room);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <div>
          <p>🌀 現在のラウンド: {currentRound}</p>
          <p>🎙️ フェーズ: {turnPhase}</p>
        </div>

        <button
          onClick={startRound}
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

            {audioURL && <audio controls src={audioURL} style={{ marginTop: 10 }} />}
            {opponent && <div style={{ marginTop: 10 }}>相手: {opponent.id}</div>}
            {self && <div style={{ marginTop: 10 }}>👤 あなた: {self.id}</div>}
            {isMyTurn && <div style={{ marginTop: 10 }}>🎤 あなたのターンです</div>}
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
