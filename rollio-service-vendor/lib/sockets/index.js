// DEPENDENCIES
const socketIO = require('socket.io');

module.exports = {
  io: null,
  socketIO,
  setIOServer(server) {
    this.io = socketIO(server);
  },
};
