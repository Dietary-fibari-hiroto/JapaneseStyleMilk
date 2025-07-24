import { Socket } from 'socket.io';

export function getRoomClientCount(room: string, socket: Socket): number {
  const clientsInRoom = socket.nsp.adapter.rooms.get(room);
  return clientsInRoom ? clientsInRoom.size : 0;
}

export function getRoomOfSocket(socket: Socket): string | null {
  return Array.from(socket.rooms).find((r) => r !== socket.id) || null;
}