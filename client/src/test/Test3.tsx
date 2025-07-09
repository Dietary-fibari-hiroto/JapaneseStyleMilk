import { useWebRTC } from "../api/webRtc/useWebRtc";

export default function Test3() {
  const {
    localVideoRef,
    remoteVideoRef,
    canCall,
    audioURL,
    isRecording,
    handleCall,
    startRecording,
    stopRecording,
  } = useWebRTC("a"); // 固定ルーム名 "a" を使う

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
        {/* 自分の映像と操作 */}
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

        {/* 相手の映像 */}
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
