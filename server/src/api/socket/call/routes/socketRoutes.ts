import { Server, Socket } from "socket.io";
import registerSocketEvents from "../controllers/socketController";

// グローバルで管理（実運用ではデータベースなどに保存するのが望ましい）
const debateTexts: {
  room: string;
  texts: DebateText[];
}[] = [];

type DebateText = {
  turn_number: number;
  sequence_in_turn: number;
  user_id: number;
  text: string;
};

function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected from IP:", socket.handshake.address);

    // ソケットイベント登録
    registerSocketEvents(io, socket);

    // ディベート発言追加イベント
    socket.on("add_debate_text", ({ room, text }: { room: string; text: DebateText }) => {
      // 部屋ごとに探す
      let roomData = debateTexts.find((r) => r.room === room);

      if (!roomData) {
        roomData = { room, texts: [] };
        debateTexts.push(roomData);
      }

      // 発言追加
      roomData.texts.push(text);

      // 他のクライアントに通知
      socket.to(room).emit("debate_text_added", text);
    });

    // ディベート最終提出
    socket.on("submit_debate", ({ room, user_id1, user_id2, debate_topic, debate_history_id }) => {
      const roomData = debateTexts.find((r) => r.room === room);
      if (!roomData) return;

      const payload = {
        user_id1,
        user_id2,
        debate_topic,
        debate_history_id,
        debate_texts: roomData.texts,
      };

      // ログで確認（実際はAPIにPOST）
      console.log("📦 Debate Submit Payload:", payload);

      // 必要であればここでDB保存・API送信

      // 初期化
      roomData.texts = [];
    });

    // 部屋参加
    socket.on("join_room", (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });
  });
}

export default setupSocket;
