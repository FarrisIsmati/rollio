// DEPENDENCIES
const mq = require('../index');

const sendVendorsRequest = async () => {
  await mq.send('requestVendors', true);
};

module.exports = sendVendorsRequest;
