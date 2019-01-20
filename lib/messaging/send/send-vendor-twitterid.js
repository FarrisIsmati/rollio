//DEPENDENCIES
const mq = require('../index');
//OPERATIONS
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');

const sendVendorTwitterIDs = async () => {
  const regionID = await regionOps.getRegionByName('WASHINGTONDC')
  .then(res => res._id)
  .catch(err => console.log(err));
  const vendors = await vendorOps.getVendors(regionID)
  .catch(err => console.log(err));
  const userIDs = vendors.map(vendor => vendor.twitterID).join(',');
  await mq.send('twitter', userIDs);
}

module.exports = sendVendorTwitterIDs;
