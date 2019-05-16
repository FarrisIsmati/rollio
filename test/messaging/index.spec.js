// DEPENDENCIES
const chai = require('chai');
const rabbitmq = require('../../lib/messaging/index');

const { expect } = chai;

describe('RabbitMQ', () => {
  describe('Send to "test" channel', () => {
    it('expect RabbitMQ instance to be connected', async () => {
      const amqp = await rabbitmq.amqp;
      expect(amqp).to.be.an('object');
    });

    it('expect "test" channel to have a message added to the Queue', async () => {
      const channel = await rabbitmq.amqp;
      await channel.assertQueue('test', { durable: false });
      const oldQueue = await channel.checkQueue('test');

      await rabbitmq.send('test', 'this is test data');
      const newQueue = await channel.checkQueue('test');

      expect(parseInt(newQueue.messageCount, 10))
        .to.be.equal(parseInt(oldQueue.messageCount, 10) + 1);
    });
  });
});
