/* eslint-disable no-console */
// DEPENDENCIES
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const logger = require('../log/index')('messaging/index');

// If running in an AWS environment use Amazons SQS for messaging
// If running in a local environment use RabbitMQ for messaging
const getMessageService = () => {
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
};

module.exports = getMessageService();
