// socketService.ts
import { Server, Socket } from "socket.io";
import { getRoomClientCount } from "../models/roomModel";

type TurnPhase = "none" | "first-turn" | "cooldown-1" | "second-turn" | "cooldown-2" | "done";
type RoomState = { round: number; phase: TurnPhase };

const hostMap = new Map<string, string>(); // roomId → host socketId
const roomStates = new Map<string, RoomState>();
const roomRounds = new Map<string, number>();



export function handleCreate(socket: Socket, room: string) {
  socket.join(room);
  roomRounds.set(room, 1);
  hostMap.set(room, socket.id);

  socket.emit("joined", {
    room,
    socketId: socket.id,
    isHost: true,
  });

  console.log(`Socket ${socket.id} created room ${room} (host)`);
}

export function handleJoin(socket: Socket, room: string) {
  const numClients = getRoomClientCount(room, socket);
  if (numClients === 1) {
    socket.join(room);
    console.log(`${socket.id} joined room [${room}]`);

    socket.emit("joined", {
      room,
      socketId: socket.id,
      isHost: false,
    });

    socket.to(room).emit("opponent joined", {
      socketId: socket.id,
    });
  } else {
    socket.emit("room full", room);
  }
}

const maxRounds = 2;
const roundConfig = {
  firstTurn:  2,
  cooldown1:  2,
  secondTurn: 2,
  cooldown2:  2,
};

export function handleStartRound(io: Server, socket: Socket, room: string) {
  const currentRound = roomStates.get(room)?.round ?? 1;

  if (currentRound > maxRounds) {
    io.to(room).emit("session ended", { message: "最大ラウンドに到達しました" });
    console.log(`Room ${room} - max round ${maxRounds} reached`);
    return;
  }

  roomStates.set(room, { round: currentRound, phase: "first-turn" });
  io.to(room).emit("turn phase", { round: currentRound, phase: "first-turn" });
  console.log(`ルーム ${room} - ラウンド ${currentRound} 開始 (1st)`);

  setTimeout(() => {
    roomStates.set(room, { round: currentRound, phase: "cooldown-1" });
    io.to(room).emit("turn phase", { round: currentRound, phase: "cooldown-1" });
    console.log(`ルーム ${room} - クールダウン1`);

    setTimeout(() => {
      roomStates.set(room, { round: currentRound, phase: "second-turn" });
      io.to(room).emit("turn phase", { round: currentRound, phase: "second-turn" });
      console.log(`ルーム ${room} - 開始 (2nd)`);

      setTimeout(() => {
        roomStates.set(room, { round: currentRound, phase: "cooldown-2" });
        io.to(room).emit("turn phase", { round: currentRound, phase: "cooldown-2" });


        if (currentRound < maxRounds) {
          console.log(`ルーム ${room} - クールダウン2`);
          setTimeout(() => {
            const nextRound = currentRound + 1;
            roomStates.set(room, { round: nextRound, phase: "first-turn" });
            io.to(room).emit("round updated", { round: nextRound });
            io.to(room).emit("turn phase", { round: nextRound, phase: "first-turn" });
            handleStartRound(io,socket,room);
          }, roundConfig.cooldown2 * 1000);
        } else {
          // 最大ラウンドならクールダウン2の処理をスキップして即終了
          io.to(room).emit("session ended", { message: "最大ラウンドに到達しました" });
          console.log(`Room ${room} - max round ${maxRounds} reached`);
          // ルーム状態のリセット
          roomStates.set(room, { round: 1, phase: "none" });
        }
      }, roundConfig.secondTurn * 1000);

    }, roundConfig.cooldown1 * 1000);

  }, roundConfig.firstTurn * 1000);
}

