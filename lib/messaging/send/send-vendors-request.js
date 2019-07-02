// DEPENDENCIES
const mq = require('../index');
const logger = require('../../log/index');

const sendVendorsRequest = async () => {
  await mq.send('requestVendors', true);
  logger.info('Send: Request for vendors');
};

module.exports = sendVendorsRequest;
