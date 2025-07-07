'use strict'
import {app} from "../../../server"

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const server = http.createServer(app);

//サーバー起動
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',   // 全てのオリジンからの接続を許可（開発用）
    methods: ['GET', 'POST'],
  }
});

//クライアントの接続処理
io.on('connection', (socket) => {
  console.log('Client connected from IP:', socket.handshake.address);
  console.log('A client connected: ' + socket.id);


  //部屋が存在するか確認
  socket.on('knock', (room) => {
    console.log(socket.id + ' is knocking room [' + room + ']');
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    socket.emit('knocked response', numClients, room);
  });

  //部屋がなかった場合、部屋を作成する。
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

  //部屋がある場合,クライアントが部屋に接続
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
  //部屋のホストが接続許可した通知を送る処理
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
    //WebRTCのシグナリング送信
    if (description.type === 'offer') {
      console.log('offer');
      socket.to(room).emit('offer', description);
    } else if (description.type === 'answer') {
      console.log('answer');
      socket.to(room).emit('answer', description);
    } else if (description.type === 'candidate') {
      socket.to(room).emit('candidate', description);
    } else {
      console.log('[ERROR] Unknown message type:', description.type);
    }
  });
  // クライアント切断時のログ出力
  socket.on('disconnect', () => {
    console.log(socket.id + " disconnected");
  });
});



