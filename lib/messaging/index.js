/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const util = require('../util/util');
const config = require('../../config');

const amqp = util.retryExternalServiceConnection(
  () => amqplib.connect(config.RABBITMQ_CONNECT)
    .then((conn) => {
      console.log('RabbitMQ: Successfully connected');
      return conn.createChannel();
    })
    .catch(async (err) => {
      console.error(err);
      return false;
    }),
  'RabbitMQ',
);

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
