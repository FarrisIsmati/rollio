// DEPENDENCIES
const mq = require('../index');

// LIB
const sendVendorTwitterIDs = require('../send/send-vendor-twitterid');

const recieveVendorsRequest = () => {
  mq.recieve('requestVendors', async (msg) => {
    const requestVendorsList = JSON.parse(msg.content);
    // Send updated vendors list
    if (requestVendorsList) {
      await sendVendorTwitterIDs();
    }
  });
};

module.exports = recieveVendorsRequest;
