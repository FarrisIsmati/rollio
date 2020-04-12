/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/send/send-vendor-twitterid');

// OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

// Get proper message name depending on if service is SQS or RabbitMQ
const getMessageLocation = (msg) => {
  if (config.AWS_ENV) {
    switch (msg) {
      case 'twitterid':
        return config.AWS_SQS_TWITTER_IDS;
      default:
        logger.error(`No QUEUE URL associated with ${msg}`);
    }
  }

  return msg;
};

const sendVendorTwitterIDs = async () => {
  const regionID = await regionOps.getRegionByName(config.REGION)
    .then(region => region._id)
    .catch((err) => {
      logger.error(err);
      return err;
    });
  const vendors = await vendorOps.getVendors(regionID)
    .catch((err) => {
      logger.info(err);
      return err;
    });
  // Puts vendors list into a string separated by ','
  const userIDs = vendors.map(vendor => vendor.twitterID).join(',');
  await mq.send(getMessageLocation('twitterid'), userIDs);
};

module.exports = sendVendorTwitterIDs;
