// socket.io-client から io 関数と Socket 型をインポート
import { io, Socket } from "socket.io-client";

// 接続先のサーバーURL（IPアドレスとポート番号を指定）
export const SERVER = "http://192.168.10.10:4000";

// サーバーにソケット接続を開始（`socket` が通信に使われる）
export const socket: Socket = io(SERVER);

// カメラとマイクの使用を許可するための制約（true で両方ON）
export const constraints: MediaStreamConstraints = {
  video: false,
  audio: true,
};

// STUNサーバーの設定（NAT越えなどに必要）
export const config: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// WebRTC 接続を管理するクラス
export class WebRTCConnection {
  // ローカルのメディアストリーム（カメラ・マイク）
  localStream: MediaStream | null = null;

  // P2P接続のための RTCPeerConnection インスタンス
  peerConnection: RTCPeerConnection | null = null;

  // 接続が開始されたかどうかのフラグ
  isStarted = false;

  // 接続する部屋名
  room: string;

  // コンストラクタで部屋名を受け取り設定
  constructor(room: string) {
    this.room = room;
  }

  // カメラとマイクからメディアストリームを取得
  async initLocalStream(): Promise<MediaStream> {
    // ユーザーのデバイスからメディアストリームを取得
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    return this.localStream;
  }

  // RTCPeerConnection を作成し、ストリームとイベントを設定
  createPeerConnection(
    onTrack: (stream: MediaStream) => void,
    onConnected?: () => void
  ) {
    // 先にカメラとマイクが初期化されていなければエラー
    if (!this.localStream) {
      throw new Error("localStream is not initialized");
    }

    // 新しい RTCPeerConnection インスタンスを作成
    this.peerConnection = new RTCPeerConnection(config);

    // 自分のストリームのトラック（映像・音声）を P2P接続に追加
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    // 相手からのメディアストリームを受け取ったときの処理
    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      // 受信したストリームをコールバックで処理
      onTrack(remoteStream);
    };

    // ICE候補が見つかったとき、サーバーを通じて相手に送信
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", {
          ...event.candidate.toJSON(), // JSON形式に変換
          room: this.room, // どの部屋かも一緒に送信
        });
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection?.connectionState === "connected") {
        console.log("通話可能になった!");
        onConnected?.();
        console.log("onCOnnect通過");
      }
    };

    // 接続状態を開始済みに設定
    this.isStarted = true;
  }

  // WebRTCの接続（オファー側）を開始する処理
  async startConnection() {
    // PeerConnectionとローカルストリームがなければ処理しない
    if (!this.peerConnection || !this.localStream) return;

    // 接続状態を開始済みに設定
    this.isStarted = true;

    // オファー（接続要求のSDP）を作成
    const offer = await this.peerConnection.createOffer();

    // オファーを自分のPeerConnectionにセット
    await this.peerConnection.setLocalDescription(offer);

    // オファーの情報をサーバー経由で相手に送信
    socket.emit("offer", {
      ...this.peerConnection.localDescription!.toJSON(),
      room: this.room,
    });
  }
}
