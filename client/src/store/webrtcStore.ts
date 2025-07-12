import { create } from "zustand";
import { WebRTCConnection } from "../api/realTimeConnection/webrtcApi"; // 君のクラスパスに合わせてね

interface WebRTCState {
  webrtc: WebRTCConnection | null;
  clearRtc: () => void;
  remoteStream: MediaStream | null;
  setWebRTC: (webrtc: WebRTCConnection) => void;
  setRemoteStream: (stream: MediaStream) => void;
  reset: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set) => ({
  webrtc: null,
  clearRtc: () => set({ webrtc: null }),
  remoteStream: null,
  setWebRTC: (webrtc) => set({ webrtc }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  reset: () => set({ webrtc: null, remoteStream: null }),
}));
