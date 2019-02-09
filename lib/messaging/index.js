//DEPENDENCIES
const amqp =  require('amqplib').connect(process.env.RABBITMQ_SERVER_ID).then(conn => conn.createChannel());

module.exports = {
  send : async (chName, data) => {
    const channel = await amqp;
    channel.assertQueue(chName, {durable: false});
    channel.sendToQueue(chName, new Buffer(JSON.stringify(data)));
    return channel;
  },
  amqp
};
