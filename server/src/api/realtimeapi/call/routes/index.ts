import { Server } from 'socket.io';
import registerSocketEvents from '../controllers/socketController';

function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected from IP:', socket.handshake.address);
    registerSocketEvents(socket);
  });
}

export default setupSocket