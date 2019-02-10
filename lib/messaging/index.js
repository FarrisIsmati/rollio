//DEPENDENCIES
const amqp =  require('amqplib').connect(process.env.RABBITMQ_SERVER_ID).then(conn => conn.createChannel());

module.exports = {
  recieve : async (chName, cb) => {
    const channel = await amqp;
    channel.assertQueue(chName, {durable: false});
    channel.consume(chName, cb, {noAck: true});
    return channel;
  },
  amqp
};
