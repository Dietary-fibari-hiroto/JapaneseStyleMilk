import { io, Socket } from "socket.io-client";

export const SERVER = "http://localhost:3000";
export const socket: Socket = io(SERVER);

export const constraints: MediaStreamConstraints = {
  video: true,
  audio: true,
};

export const config: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export class WebRTCConnection {
  localStream: MediaStream | null = null;
  peerConnection: RTCPeerConnection | null = null;
  isStarted = false;
  room: string;

  constructor(room: string) {
    this.room = room;
  }

  async initLocalStream(): Promise<MediaStream> {
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    return this.localStream;
  }

  createPeerConnection(onTrack: (stream: MediaStream) => void) {
    if (!this.localStream) {
      throw new Error("localStream is not initialized");
    }

    this.peerConnection = new RTCPeerConnection(config);

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      onTrack(remoteStream);
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { ...event.candidate.toJSON(), room: this.room });
      }
    };

    this.isStarted = true;
  }

  async startConnection() {
    if (!this.peerConnection || !this.localStream) return;

    this.isStarted = true;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    socket.emit("offer", { ...this.peerConnection.localDescription!.toJSON(), room: this.room });
  }
}
