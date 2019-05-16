/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const util = require('../util/util');
const config = require('../../config');

// EXPONENTIAL BACKOFF RETRY CONNECTION!!!
let connectAttempt = 0;
let backoffTime = 2;

const amqpConnect = async () => {
  const connectToRabbitMQ = () => {
    return amqplib.connect(config.RABBITMQ_CONNECT)
      .then(conn => conn.createChannel())
      .catch(async (err) => {
        console.error(err);
        return false;
      });
  }

  let connectionResult = await connectToRabbitMQ();

  while (!connectionResult && connectAttempt < 5) {
    console.log('RABBITMQ: CONNECT AGAIN');
    let time = util.backoff(backoffTime, () => {
      backoffTime *= 2;
    })
    connectAttempt += 1;
    console.log(`time: ${time}`);
    console.log(`attempts: ${connectAttempt}`);
    connectionResult = await connectToRabbitMQ();
  }

  return connectionResult;
}

const amqp = amqpConnect();

amqp.then((res) => {
  console.log('this is the response!');
  console.log(res)
})


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
