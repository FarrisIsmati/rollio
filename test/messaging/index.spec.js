//DEPENDENCIES
const rabbitmq = require('../../lib/messaging/index');
const chai = require('chai');
const expect = chai.expect;

describe('RabbitMQ', function() {
  describe('Send to "test" channel', function() {
    it('expect RabbitMQ instance to be connected', async function() {
      const amqp = await rabbitmq.amqp;
      expect(amqp).to.be.an('object');
    });
    it('expect "test" channel to have a message added to the Queue', async function() {
      const channel = await rabbitmq.amqp;
      await channel.assertQueue('test', {durable: false});
      const oldQueue = await channel.checkQueue('test');

      await rabbitmq.send('test','this is test data');
      const newQueue = await channel.checkQueue('test');
      expect(parseInt(newQueue.messageCount)).to.be.equal(parseInt(oldQueue.messageCount) + 1);
    })
  });
});
