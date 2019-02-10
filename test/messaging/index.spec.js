//DEPENDENCIES
const rabbitmq = require('../../lib/messaging/index');
const chai = require('chai');
const expect = chai.expect;

describe('RabbitMQ', function() {
  describe('Recieve from "test" channel', function() {
    it('Expect RabbitMQ instance to be connected', async function() {
      const amqp = await rabbitmq.amqp;
      expect(amqp).to.be.an('object');
    });
    it('Expect "test" channel to recieve a message from the Queue', async function() {
      const message = 'hello test';
      const channel = await rabbitmq.amqp;
      await channel.assertQueue('test', {durable: false});
      await channel.sendToQueue('test', new Buffer(JSON.stringify(message)));
      await rabbitmq.recieve('test', msg => {
        expect(JSON.parse(msg.content)).to.be.equal(message);
      });
    })
  });
});
