//DEPENDENCIES
const amqp =  require('amqplib').connect('amqp://localhost').then(conn => conn.createChannel());

module.exports = {
  send : async (chName, data) => {
    const channel = await amqp;
    channel.assertQueue(chName, {durable: false});
    channel.sendToQueue(chName, new Buffer(data));
  }
};
