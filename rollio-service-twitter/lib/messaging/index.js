/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const util = require('../util/util');
const config = require('../../config');
const logger = require('../log/index')('messaging/index');

// If running in an AWS environment use Amazons SQS for messaging
// If running in a local environment use RabbitMQ for messaging
const getMessageService = () => {
  console.log(config.AWS_ENV);
  // AWS Setup
  if (config.AWS_ENV) {
    AWS.config.update({ region: 'us-east-1' });

    // Create SQS service client
    const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

    return {
      send: async (queueURL, messageBody) => {
        const params = {
          DelaySeconds: 2,
          MessageBody: JSON.stringify(messageBody),
          QueueUrl: queueURL,
        };
        logger.info(`Message sent: ${queueURL}`);
        logger.info(JSON.stringify(params));
        sqs.sendMessage(params, (err, data) => {
          if (err) {
            logger.error(err);
          } else {
            logger.info(`Message Sent: ${JSON.stringify(data)}`);
          }
        });
      },

      receive: async (queueURL, cb) => {
        const consumer = Consumer.create({
          queueUrl: queueURL,
          handleMessage: async (message) => {
            logger.info(`Message received: ${queueURL}`);
            logger.info(message.Body);
            cb({ content: message.Body });
          },
        });

        consumer.on('error', (err) => {
          logger.error(err.message);
        });

        consumer.on('processing_error', (err) => {
          logger.error(err.message);
        });

        consumer.start();

        return consumer;
      },
    };
  }

  // Rabbit MQ Setup
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

  return {
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
};

module.exports = getMessageService();
