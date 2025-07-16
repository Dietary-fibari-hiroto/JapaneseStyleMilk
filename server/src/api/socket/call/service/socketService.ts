import { Socket } from 'socket.io';
import { getRoomClientCount, getRoomOfSocket } from '../models/roomModel';
import { Server } from "socket.io";

const hostMap = new Map<string, string>(); // roomId -> host socketId

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

type TurnPhase =
  | "none"
  | "first-turn"
  | "cooldown-1"
  | "second-turn"
  | "cooldown-2"
  | "done";


// ラウンドのインターバル（秒）
const roundDuration = 3;

const roundTimers = new Map<string, NodeJS.Timeout>();

type RoomState = {
  round: number;
  phase: TurnPhase;
};

const maxRounds = 1; //ラウンド数

const roundConfig = {
  firstTurn: 5,    // 秒
  cooldown1: 3,
  secondTurn: 5,
  cooldown2: 3,
};


const roomStates = new Map<string, RoomState>();
const roomRounds = new Map<string, number>(); // 例: roomId => currentRound

export function handleStartRound(io: Server, socket: Socket, room: string) {
  const currentRound = roomStates.get(room)?.round ?? 1;

  if (currentRound > maxRounds) {
    io.to(room).emit("session ended", { message: "最大ラウンドに到達しました" });
    console.log(`Room ${room} - max round ${maxRounds} reached`);
    return;
  }

  roomStates.set(room, { round: currentRound, phase: "first-turn" });
  io.to(room).emit("turn phase", { round: currentRound, phase: "first-turn" });
  console.log(`Room ${room} - Round ${currentRound} started (first-turn)`);

  setTimeout(() => {
    roomStates.set(room, { round: currentRound, phase: "cooldown-1" });
    io.to(room).emit("turn phase", { round: currentRound, phase: "cooldown-1" });
    console.log(`Room ${room} - cooldown-1`);

    setTimeout(() => {
      roomStates.set(room, { round: currentRound, phase: "second-turn" });
      io.to(room).emit("turn phase", { round: currentRound, phase: "second-turn" });
      console.log(`Room ${room} - second-turn`);

      setTimeout(() => {
        roomStates.set(room, { round: currentRound, phase: "cooldown-2" });
        io.to(room).emit("turn phase", { round: currentRound, phase: "cooldown-2" });
        console.log(`Room ${room} - cooldown-2`);
        
        //もしラウンド数が最大に達していたら、最後のクールタイムを無効
        if(currentRound !== maxRounds){ 
          setTimeout(() => {
            const nextRound = currentRound + 1;

            roomStates.set(room, { round: nextRound, phase: "first-turn" });
            io.to(room).emit("round updated", { round: nextRound });
            io.to(room).emit("turn phase", { round: nextRound, phase: "first-turn" });
            console.log(`Room ${room} - Round ${nextRound} started`);
          }, roundConfig.cooldown2 * 1000);
        }else{
              io.to(room).emit("session ended", { message: "最大ラウンドに到達しました" });
              console.log(`Room ${room} - max round ${maxRounds} reached`);
              return;
        }
      }, roundConfig.secondTurn * 1000);

    }, roundConfig.cooldown1 * 1000);

  }, roundConfig.firstTurn * 1000);
}



export function handleCreate(socket: Socket, room: string) {
  socket.join(room);
  roomRounds.set(room, 1); //ラウンドをXから開始する
  hostMap.set(room, socket.id); // ホスト登録

  socket.emit('joined', room, socket.id, true); // isHost: true
  socket.to(room).emit('joined', room, socket.id, false); // isHost: false

  console.log(`Socket ${socket.id} created/joined room ${room} (host)`);
}



export function handleNextRound(io: Server, socket: Socket, room: string) {
  const currentRound = roomRounds.get(room) || 1;
  const nextRound = currentRound + 1;
  roomRounds.set(room, nextRound);

  // 全員に通知
  io.to(room).emit("round updated", { round: nextRound });
}



export function handleJoin(io: Server, socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 1) {
    socket.join(room);
    console.log(`${socket.id} joined room [${room}]`);

    const hostId = hostMap.get(room);

    socket.emit('joined', room, socket.id, socket.id === hostId); // ホストかどうか
    socket.to(room).emit('joined', room, socket.id, false); // 相手には常に false
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


