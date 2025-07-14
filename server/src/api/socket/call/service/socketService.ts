import { Socket } from 'socket.io';
import { getRoomClientCount, getRoomOfSocket } from '../models/roomModel';
import { Server } from "socket.io";

export function handleKnock(socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 0) {
    socket.emit('knocked response', 0, room);  // 新規作成
  } else if (numClients === 1) {
    socket.emit('knocked response', 1, room);  // 参加OK
  } else {
    socket.emit('room full', room);            // 2人以上は不可
  }
}

// ラウンドのインターバル（秒）
const roundDuration = 3;

const roundTimers = new Map<string, NodeJS.Timeout>();

export function handleStartRound(io: Server, socket: Socket, room: string) {
  let currentRound = roomRounds.get(room) || 1;

  if (roundTimers.has(room)) {
    clearTimeout(roundTimers.get(room)!);
  }

  console.log(`Room ${room} - Round ${currentRound} started by ${socket.id}`);

  io.to(room).emit("round started", { round: currentRound });

  const timer = setTimeout(() => {
    io.to(room).emit("round ended", { round: currentRound });
    console.log(`Room ${room} - Round ${currentRound} ended`);

    // ラウンド終了後に更新
    const nextRound = currentRound + 1;
    roomRounds.set(room, nextRound);

    io.to(room).emit("round updated", { round: nextRound });
  }, roundDuration * 1000);

  roundTimers.set(room, timer);
}




const roomRounds = new Map<string, number>(); // 例: roomId => currentRound
export function handleCreate(socket: Socket, room: string) {
  socket.join(room);
  roomRounds.set(room, 1); // ラウンド1から開始
  socket.emit('joined', room, socket.id);
  socket.to(room).emit('joined', room, socket.id); // 相手に送る（存在すれば）
  console.log(`Socket ${socket.id} created/joined room ${room}`);
}


export function handleNextRound(io: Server, socket: Socket, room: string) {
  const currentRound = roomRounds.get(room) || 1;
  const nextRound = currentRound + 1;
  roomRounds.set(room, nextRound);

  // 全員に通知
  io.to(room).emit("round updated", { round: nextRound });
}




export function handleJoin(io: Server,socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 1) {
    socket.join(room);
    console.log(`${socket.id} joined room [${room}]`);
    const members = io.sockets.adapter.rooms.get(room);
    console.log("Room members after join:", members ? [...members] : []);
    
    socket.emit('joined', room, socket.id);         
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

export function handleMessage(io: Server, socket: Socket, description: any) {
  const room = getRoomOfSocket(socket);
  if (!room) {
    console.log('No room found for socket', socket.id);
    return;
  }

  switch (description.type) {
    case 'offer':
      io.in(room).emit('offer', description);
      break;
    case 'answer':
      io.in(room).emit('answer', description);
      break;
    case 'candidate':
      socket.to(room).emit('candidate', description);
      break;

    default:
      console.log('[ERROR] Unknown message type:', description.type);
  }
}


