/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const util = require('../util/util');
const config = require('../../config');
const logger = require('../log/index')('messaging/index');

const amqp = util.retryExternalServiceConnection(
  () => amqplib.connect(config.RABBITMQ_CONNECT)
    .then((conn) => {
      if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') {
        logger.info('RabbitMQ: Successfully connected');
      }
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
    if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') {
      logger.info('Message sent');
      logger.info(data);
    }
    return channel;
  },
  receive: async (chName, cb) => {
    const channel = await amqp;
    channel.assertQueue(chName, { durable: false });
    channel.consume(chName, cb, { noAck: true });
    if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') {
      logger.info('Message recieved');
    }
    return channel;
  },
  amqp,
};
