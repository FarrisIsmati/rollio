/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const util = require('../util/util');
const config = require('../../config');
const logger = require('../log/index');

const amqp = util.retryExternalServiceConnection(
  () => amqplib.connect(config.RABBITMQ_CONNECT)
    .then((conn) => {
      logger.info('RabbitMQ: Successfully connected');
      return conn.createChannel();
    })
    .catch(() => false),
  'RabbitMQ',
);

module.exports = {
  send: async (chName, data) => {
    const channel = await amqp;
    channel.assertQueue(chName, { durable: false });
    channel.sendToQueue(chName, Buffer.from(JSON.stringify(data)));
    logger.info('RabbitMQ: Message sent');
    logger.info(data);
    return channel;
  },
  receive: async (chName, cb) => {
    const channel = await amqp;
    channel.assertQueue(chName, { durable: false });
    channel.consume(chName, cb, { noAck: true });
    return channel;
  },
  amqp,
};
