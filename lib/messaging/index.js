/* eslint-disable no-console */
// DEPENDENCIES
const amqp = require('amqplib')
  .connect(process.env.RABBITMQ_SERVER_ID)
  .then(conn => conn.createChannel())
  .catch(err => console.error(err));

module.exports = {
  send: async (chName, data) => {
    const channel = await amqp;
    channel.assertQueue(chName, { durable: false });
    channel.sendToQueue(chName, Buffer.from(JSON.stringify(data)));
    return channel;
  },
  recieve: async (chName, cb) => {
    const channel = await amqp;
    channel.assertQueue(chName, { durable: false });
    channel.consume(chName, cb, { noAck: true });
    return channel;
  },
  amqp,
};
