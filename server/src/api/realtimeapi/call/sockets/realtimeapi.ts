import { Socket } from 'socket.io';
import { getRoomClientCount, getRoomOfSocket } from '../models/roomModel';

const waitingRoomQueue: string[] = [];

export function handleKnock(socket: Socket, _: string) {
  if (waitingRoomQueue.length > 0) {
    const room = waitingRoomQueue.shift(); // 先に待ってた部屋に入れる
    socket.emit('knocked response', 1, room); // 1人いるよ
  } else {
    const newRoom = Math.random().toString(36).substring(2, 10);
    waitingRoomQueue.push(newRoom);
    socket.emit('knocked response', 0, newRoom); // 新しく作る
  }
}


export function handleCreate(socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 0) {
    socket.join(room);
    console.log(`${socket.id} created room [${room}]`);
    socket.emit('created', room);
  } else {
    socket.emit('room full', room);
  }
}

export function handleJoin(socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 1) {
    socket.join(room);
    console.log(`${socket.id} joined room [${room}]`);
    socket.to(room).emit('joined', room, socket.id);
  } else {
    socket.emit('room full', room);
  }
}

export function handleAllow(socket: Socket, room: string) {
  console.log(`room host allowed joining for room: ${room}`);
  socket.to(room).emit('allowed');
  socket.emit('allowed');
}

export function handleMessage(socket: Socket, description: any) {
  const room = getRoomOfSocket(socket);
  if (!room) {
    console.log('No room found for socket', socket.id);
    return;
  }

  switch (description.type) {
    case 'offer':
      socket.to(room).emit('offer', description);
      break;
    case 'answer':
      socket.to(room).emit('answer', description);
      break;
    case 'candidate':
      socket.to(room).emit('candidate', description); // ここでは description.candidate をそのまま送る
      break;
    default:
      console.log('[ERROR] Unknown message type:', description.type);
  }
}

