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
    it('Expect "test" channel to send a message to the Queue', async function() {
      const chName = 'testSend'
      const message = 'hello test send';
      const channel = await rabbitmq.amqp;
      await rabbitmq.send(chName, message);
      await channel.assertQueue(chName, {durable: false});
      await channel.consume(chName, msg => {
        expect(JSON.parse(msg.content)).to.be.equal(message);
      }, {noAck: true});
    })
    it('Expect "test" channel to recieve a message from the Queue', async function() {
      const chName = 'testRecieve'
      const message = 'hello test recieve';
      const channel = await rabbitmq.amqp;
      await channel.assertQueue(chName, {durable: false});
      await channel.sendToQueue(chName, new Buffer(JSON.stringify(message)));
      await rabbitmq.recieve(chName, msg => {
        expect(JSON.parse(msg.content)).to.be.equal(message);
      });
    })
  });
});
