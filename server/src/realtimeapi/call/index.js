'use strict'

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',//テスト用にすべてのポートにしてます。http://サーバーip:3000で接続できます
    methods: ['GET', 'POST'],
  }
});

const PORT = process.env.PORT || 5001;

io.on('connection', (socket) => {
console.log('Client connected from IP:', socket.handshake.address);
  console.log('A client connected: ' + socket.id);

  socket.on('knock', (room) => {
    console.log(socket.id + ' is knocking room [' + room + ']');
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    socket.emit('knocked response', numClients, room);
  });

  socket.on('create', (room) => {
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    if (numClients === 0) {
      socket.join(room);
      console.log(socket.id + ' created room [' + room + ']');
      socket.emit('created', room);
    } else {
      socket.emit('room full', room);
    }
  });

  socket.on('join', (room) => {
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    if (numClients === 1) {
      socket.join(room);
      console.log(socket.id + ' joined room [' + room + ']');
      io.to(room).emit('joined', room, socket.id);
    } else {
      socket.emit('room full', room);
    }
  });

  socket.on('allow', (room) => {
    console.log('room host allowed joining for room:', room);
    socket.to(room).emit('allowed');  // room内の自分以外に通知
    socket.emit('allowed');           // 自分にも通知
  });

  socket.on('message', (description) => {
    const room = Array.from(socket.rooms).find(r => r !== socket.id);
    if (!room) {
      console.log('No room found for socket', socket.id);
      return;
    }
    if (description.type === 'offer') {
      console.log('offer');
      socket.to(room).emit('offer', description);
    } else if (description.type === 'answer') {
      console.log('answer');
      socket.to(room).emit('answer', description);
    } else if (description.type === 'candidate') {
      console.log('candidate');
      socket.to(room).emit('candidate', description);
    } else {
      console.log('[ERROR] Unknown message type:', description.type);
    }
  });

  socket.on('disconnect', () => {
    console.log(socket.id + " disconnected");
  });
});

server.listen(PORT, () => {
  console.log('Listening... PORT: ' + PORT);
});
