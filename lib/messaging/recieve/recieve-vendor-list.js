//DEPENDENCIES
const mq = require('../index');
const twitter = require('../../twitter/index');

const recieveVendorList = () => {
  mq.recieve('twitterid', (msg) => {
    const vendorList = JSON.parse(msg.content).split(',');
    const parse = () => {};
    twitter.streamClient(parse, vendorList);
  });
}

module.exports = recieveVendorList;
