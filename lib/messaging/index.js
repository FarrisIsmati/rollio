//DEPENDENCIES
const amqp =  require('amqplib').connect('amqp://localhost').then(conn => conn.createChannel());

module.exports = {
  recieve : async (chName, cb) => {
    const channel = await amqp;
    channel.assertQueue(chName, {durable: false});
    channel.consume(chName, cb, {noAck: true});
  }
};
