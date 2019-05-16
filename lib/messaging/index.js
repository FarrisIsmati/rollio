/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const util = require('../util/util');
const config = require('../../config');

const amqpRetryConnection = {
  connectAttempts: 0,
  backoffMultiplyer: 2,
  async connect() {
    // Will connect again if it fails
    const connection = await amqplib.connect(config.RABBITMQ_CONNECT)
      .then((conn) => {
        console.log('RabbitMQ: Successfully connected');
        return conn.createChannel();
      })
      .catch(async (err) => {
        console.error(err);
        return false;
      });
    if (!connection && this.connectAttempts < 6) {
      console.log('RabbitMQ: Connection failed retrying again');
      this.connectAttempts += 1;
      const time = util.backoff(this.backoffMultiplyer);
      this.backoffMultiplyer *= 1.5;
      console.log(`time: ${time}`);
      console.log(`attempts: ${this.connectAttempts}`);
      this.connect();
    }
    return connection;
  },
};

const amqp = amqpRetryConnection.connect();

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
