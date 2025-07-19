import { Server, Socket } from "socket.io";
import { handleStartRound, handleJoin, handleCreate } from "../service/socketService";

const roomAccounts = new Map<string, number>(); // socket.id → accountId

export default function registerSocketEvents(io: Server, socket: Socket) {
  socket.on("knock", (room: string) => {
    const clients = io.sockets.adapter.rooms.get(room);
    const numClients = clients ? clients.size : 0;
    socket.emit("knocked response", numClients);
  });

  socket.on("create", (room: string, accountId: number) => {
    roomAccounts.set(socket.id, accountId);
    handleCreate(socket, room);
  });

  socket.on("join", (room: string, accountId: number) => {
    roomAccounts.set(socket.id, accountId);
    handleJoin(socket, room);
  });

  socket.on("offer", (desc: RTCSessionDescriptionInit & { room: string }) => {
    console.log(`[offer] from ${socket.id} to room: ${desc.room}`);
    socket.to(desc.room).emit("offer", desc);
  });

  socket.on("answer", (desc: RTCSessionDescriptionInit & { room: string }) => {
    console.log(`[answer] from ${socket.id} to room: ${desc.room}`);
    socket.to(desc.room).emit("answer", desc);
  });

  socket.on("candidate", (candidate: RTCIceCandidateInit & { room: string }) => {
    socket.to(candidate.room).emit("candidate", candidate);
  });

  socket.on("transcription_result", (data) => {
    const [_, roomId] = Array.from(socket.rooms); // socket.id以外のルーム
    if (roomId) {
      socket.broadcast.to(roomId).emit("transcription_result", data);
    }
  });


  socket.on("start round", (room: string) => {
    console.log(`start round received from ${socket.id} for room ${room}`);
    handleStartRound(io, socket, room);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    roomAccounts.delete(socket.id);
  });
}