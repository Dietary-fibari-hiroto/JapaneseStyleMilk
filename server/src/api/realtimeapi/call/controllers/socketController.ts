import { Server, Socket } from "socket.io";

export default function registerSocketEvents(io: Server, socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

  socket.on("knock", (room: string) => {
    console.log(`[knock] ${socket.id} requests to join room: ${room}`);
    const clients = io.sockets.adapter.rooms.get(room);
    const numClients = clients ? clients.size : 0;
    socket.emit("knocked response", numClients, room);
  });

  socket.on("create", (room: string) => {
    console.log(`[create] ${socket.id} creates room: ${room}`);
    socket.join(room);
    socket.emit("created");
  });

  socket.on("join", (room: string) => {
    console.log(`[join] ${socket.id} joins room: ${room}`);
    socket.join(room);
    io.to(room).emit("joined");
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
    console.log(`[candidate] from ${socket.id} to room: ${candidate.room}`);
    socket.to(candidate.room).emit("candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}
