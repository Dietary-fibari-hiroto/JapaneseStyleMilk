// server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const port = 5500;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', 
        methods:['*']
  }, // 一旦どこからでも接続許可
});
const waitingUsers: string[] = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

    socket.on('findMatch', () => {
    // 自分以外を見つける
    const peerIndex = waitingUsers.findIndex((id) => id !== socket.id);
    
    if (peerIndex !== -1) {
        const peerId = waitingUsers.splice(peerIndex, 1)[0]; // 対象を取り除く
        socket.emit('matchFound', peerId);
        io.to(peerId).emit('matchFound', socket.id);
    } else {
        // 自分しかいない、またはマッチできる相手がいない
        if (!waitingUsers.includes(socket.id)) {
            waitingUsers.push(socket.id);
        }
    }
    });

    socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

  // プライベートメッセージの受信＆転送
  socket.on('private-message', ({ to, message }) => {
    console.log(`Message from ${socket.id} to ${to}: ${message}`);
    io.to(to).emit('private-message', { from: socket.id, message });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const index = waitingUsers.indexOf(socket.id);
    if (index !== -1) {
        waitingUsers.splice(index, 1);
    }
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);}
);
