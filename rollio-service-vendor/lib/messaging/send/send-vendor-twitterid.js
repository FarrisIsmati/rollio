/* eslint-disable no-console */
// DEPENDENCIES
const mq = require('../index');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/send/send-vendor-twitterid');

// OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

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
  await mq.send('twitterid', userIDs);
};

module.exports = sendVendorTwitterIDs;
