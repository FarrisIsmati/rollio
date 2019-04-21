/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// DEPENDENCIES
const mq = require('../index');

// OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

const sendVendorTwitterIDs = async () => {
  const regionID = await regionOps.getRegionByName('WASHINGTONDC')
    .then(region => region._id)
    .catch((err) => {
      console.error(err);
      return err;
    });

  const vendors = await vendorOps.getVendors(regionID)
    .catch((err) => {
      console.err(err);
      return err;
    });

  const userIDs = vendors.map(vendor => vendor.twitterID).join(',');
  await mq.send('twitterid', userIDs);
};

module.exports = sendVendorTwitterIDs;
