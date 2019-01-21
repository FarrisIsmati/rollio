//DEPENDENCIES
const mq = require('../index');
const twitter = require('../../twitter/index');
const twitterParser = require('../../twitter/parse/tweet-parser');

const recieveVendorList = () => {
  //twitter.test();
  mq.recieve('twitterid', (msg) => {
    const vendorList = JSON.parse(msg.content);
    twitter.streamClient(twitterParser.scanAddress,vendorList);
  });
}

module.exports = recieveVendorList;
