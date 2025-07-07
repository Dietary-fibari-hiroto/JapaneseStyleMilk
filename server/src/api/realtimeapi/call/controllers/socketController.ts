import { Socket } from 'socket.io';
import * as socketService from '../sockets/realtimeapi';

function registerSocketEvents(socket: Socket) {
  console.log('A client connected:', socket.id);

  socket.on('knock', (room) => socketService.handleKnock(socket, room));
  socket.on('create', (room) => socketService.handleCreate(socket, room));
  socket.on('join', (room) => socketService.handleJoin(socket, room));
  socket.on('allow', (room) => socketService.handleAllow(socket, room));
  socket.on('message', (description) => socketService.handleMessage(socket, description));
  socket.on('disconnect', () => console.log(socket.id + ' disconnected'));
}

export default registerSocketEvents;