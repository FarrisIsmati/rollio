/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/send/send-vendor-twitterid');

// OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

const sendVendorTwitterIDs = async () => {
  console.log('SEND');
  const regionID = await regionOps.getRegionByName(config.REGION)
    .then(region => {
      if (region) {
        return region._id
      }
      
      logger.error('Messaging: Send vendor twitter IDs no region found');
      return null;
    })
    .catch((err) => {
      logger.error(err);
      return err;
    });

  const vendors = await vendorOps.getVendors(regionID)
    .catch((err) => {
      logger.error(err);
      return err;
    });

  // Puts vendors list into a string separated by ','
  const userIDs = vendors.filter(vendor => vendor.twitterID).map(vendor => vendor.twitterID).join(',');
  await mq.send(config.AWS_SQS_TWITTER_IDS, userIDs);
  logger.info('Sent Vendor TwitterIDs');
};

module.exports = {
  sendVendorTwitterIDs
};
