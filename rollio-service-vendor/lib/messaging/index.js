/* eslint-disable no-console */
// DEPENDENCIES
const amqplib = require('amqplib');
const AWS = require('aws-sdk');
const util = require('../util/util');
const config = require('../../config');
const logger = require('../log/index')('messaging/index');

// If running in an AWS environment use Amazons SQS for messaging
// If running in a local environment use RabbitMQ for messaging
const getMessageService = () => {
  // AWS Setup
  if (config.AWS_ENV) {
    AWS.config.update({ region: 'us-east-1' });

    // Create SQS service client
    const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

    return {
      send: async (queueURL, messageBody) => {
        const params = {
          DelaySeconds: 2,
          MessageBody: messageBody,
          QueueUrl: queueURL,
        };

        sqs.sendMessage(params, (err, data) => {
          if (err) {
            console.log('Error', err);
          } else {
            console.log('Success', data.MessageId);
          }
        });
      },
      receive: async (queueURL, cb) => {
        const params = {
          AttributeNames: [
            'SentTimestamp',
          ],
          MaxNumberOfMessages: 10,
          MessageAttributeNames: [
            'All',
          ],
          QueueUrl: queueURL,
          VisibilityTimeout: 20,
          WaitTimeSeconds: 0,
        };

        sqs.receiveMessage(params, (err, data) => {
          if (err) {
            console.log('Receive Error', err);
          } else if (data.Messages) {
            cb({ content: data.Messages });
            const deleteParams = {
              QueueUrl: queueURL,
              ReceiptHandle: data.Messages[0].ReceiptHandle,
            };
            sqs.deleteMessage(deleteParams, (err, data) => {
              if (err) {
                console.log('Delete Error', err);
              } else {
                console.log('Message Deleted', data);
              }
            });
          }
        });
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
