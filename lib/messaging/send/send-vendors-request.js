// DEPENDENCIES
const mq = require('../index');

const sendVendorsRequest = async () => {
  await mq.send('requestVendors', true);
  console.log('Send: Request for vendors');
};

module.exports = sendVendorsRequest;
