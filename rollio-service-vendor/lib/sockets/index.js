// DEPENDENCIES
const socketIO = require('socket.io');

const socket = {
  io: null,
  socketIO,
  setIOServer(server) {
    socket.io = socket.socketIO(server);
  },
};

module.exports = socket;
