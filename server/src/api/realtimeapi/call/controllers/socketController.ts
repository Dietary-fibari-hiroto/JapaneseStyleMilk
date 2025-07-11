// socket.io から Server と Socket 型をインポート
import { IntegerDataType } from "sequelize";
import { Server, Socket } from "socket.io";
const roomAccounts = new Map<string, number>(); // socket.id → accountId
// registerSocketEvents 関数をエクスポート（引数はサーバーインスタンスとクライアントソケット）
export default function registerSocketEvents(io: Server, socket: Socket) {
  // クライアントから "knock" イベントを受信したときの処理
  socket.on("knock", (room: string) => {
    // どのクライアントがどの部屋にノックしてきたかログ出力
    console.log(`[knock] ${socket.id} ノックしたよ: ${room}`);

    // 指定された部屋に現在いるクライアント一覧を取得
    const clients = io.sockets.adapter.rooms.get(room);

    // クライアント数を取得（部屋が存在しない場合は 0）
    const numClients = clients ? clients.size : 0;
    // ノックしたクライアントに部屋の人数と部屋名を返信
    socket.emit("knocked response", numClients);
  });

  // クライアントから "create" イベントを受信したときの処理
  socket.on("create", (room: string, accountId: number) => {
    // どのクライアントがどの部屋を作成しようとしているかログ出力
    console.log("careatに入って受け取ったID:", accountId);
    roomAccounts.set(socket.id, accountId);
    // クライアントを指定した部屋に参加させる
    socket.join(room);

    // 作成完了をクライアントに通知
    socket.emit("created");
  });

  // クライアントから "join" イベントを受信したときの処理
  socket.on("join", (room: string, accountId: number) => {
    // どのクライアントがどの部屋に参加しようとしているかログ出力
    console.log("joinバックで受け取ったID:", accountId);
    // クライアントを指定した部屋に参加させる
    socket.join(room);
    //アカウントIDを保存しておくう
    roomAccounts.set(socket.id, accountId);

    //その部屋の他の人たちに自分のIDを送る
    socket.to(room).emit("peer-joined", {
      socketId: socket.id,
      accountId,
    });
    console.log(
      "現在のルーム内クライアント一覧:",
      Array.from(io.sockets.adapter.rooms.get(room) || [])
    );

    //すでに部屋にいた他の人のIDを自分に送る
    const others = Array.from(io.sockets.adapter.rooms.get(room) || []).filter(
      (id) => id !== socket.id
    );

    others.forEach((otherSocketId) => {
      const otherId = roomAccounts.get(otherSocketId);
      if (otherId) {
        socket.emit("peer-joined", {
          socketId: otherSocketId,
          accountId: otherId,
        });
      }
    });
    // 部屋の全員に参加通知（自分も含む）
    io.to(room).emit("joined", { accountId });
  });

  // クライアントから "offer" イベントを受信したときの処理（WebRTC: 接続要求）
  socket.on("offer", (desc: RTCSessionDescriptionInit & { room: string }) => {
    // どのクライアントがどの部屋にオファーを送ったかログ出力
    console.log(`[offer] from ${socket.id} to room: ${desc.room}`);

    // 同じ部屋にいる他のクライアントに offer を転送
    socket.to(desc.room).emit("offer", desc);
  });

  // クライアントから "answer" イベントを受信したときの処理（WebRTC: 応答）
  socket.on("answer", (desc: RTCSessionDescriptionInit & { room: string }) => {
    // どのクライアントがどの部屋にアンサーを送ったかログ出力
    console.log(`[answer] from ${socket.id} to room: ${desc.room}`);

    // 同じ部屋にいる他のクライアントに answer を転送
    socket.to(desc.room).emit("answer", desc);
  });

  // クライアントから "candidate" イベントを受信したときの処理（WebRTC: ICE候補）
  socket.on(
    "candidate",
    (candidate: RTCIceCandidateInit & { room: string }) => {
      // どのクライアントがどの部屋に candidate を送ったかログ出力
      console.log(`[candidate] from ${socket.id} to room: ${candidate.room}`);

      // 同じ部屋にいる他のクライアントに ICE候補 を転送
      socket.to(candidate.room).emit("candidate", candidate);
    }
  );

  // クライアントが切断されたときの処理
  socket.on("disconnect", () => {
    // 切断されたクライアントのソケットIDをログ出力
    console.log(`Client disconnected: ${socket.id}`);
    roomAccounts.delete(socket.id);
  });
}
