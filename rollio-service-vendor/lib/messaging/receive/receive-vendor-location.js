/* eslint-disable max-len */
/* eslint-disable no-console */
// DEPENDENCIES
const { get } = require('lodash');
const mq = require('../index');
const regionOps = require('../../db/mongo/operations/region-ops');
const vendorOps = require('../../db/mongo/operations/vendor-ops');
const sharedOps = require('../../db/mongo/operations/shared-ops');
const { sendEmailToAdminAccount } = require('../../email/send-email');
const config = require('../../../config');
const logger = require('../../log/index')('messaging/receive/receive-vendor-location');

const addDocumentToVendorHistory = async (payload, field, regionID, vendorID) => {
  const params = {
    regionID, vendorID, field, payload,
  };
  const updatedVendor = await vendorOps.updateVendorPush(params).catch((err) => {
    logger.error(err);
  });
  return get(updatedVendor, field).pop();
};

// Update the tweetHistory property
const addTweetToVendorTweetHistory = async (payload, regionID, vendorID) => {
  return addDocumentToVendorHistory(payload, 'tweetHistory', regionID, vendorID);
};

// Update the locationHistory property
const addLocationToVendorLocationHistory = async (payload, regionID, vendorID) => {
  return addDocumentToVendorHistory(payload, 'locationHistory', regionID, vendorID);
};


const createNewLocations = async ({
  tweetLocationPayloads, tweetID, vendorID, regionID,
}) => {
  console.log('');
  console.log(tweetLocationPayloads);
  const newLocations = await Promise.all(tweetLocationPayloads.map(location => sharedOps.createLocationAndCorrectConflicts({ ...location, tweetID, vendorID })));
  await Promise.all(newLocations.map(newLocation => addLocationToVendorLocationHistory(newLocation._id, regionID, vendorID)));
  return newLocations;
};


const receiveTweets = async () => {
  mq.receive(config.AWS_SQS_PARSED_TWEETS, async (msg) => {
    const message = JSON.parse(msg.content);
    logger.info('Received tweet');
    logger.info(msg.content);

    const { _id: regionID } = await regionOps.getRegionByName(config.REGION);
    const vendor = await vendorOps.getVendorByTwitterID(regionID, message.twitterID);
    const { _id: vendorID, name: vendorName } = vendor;

    const {
      tweet: text, 
      tweetID, date, 
      newLocations: tweetLocationPayloads, 
      twitterID, 
      match
    } = message;

    // If tweet has a match create locations, else return empty array
    const newLocations = match ? await createNewLocations({
      tweetLocationPayloads, tweetID, vendorID, regionID
    }) : [];

    // Format tweet as it is stored in vendor.tweetHistory
    const tweetPayload = {
      date,
      locations: newLocations.map(location => location._id),
      text,
      tweetID,
      usedForLocation: !!tweetLocationPayloads.length,
      vendorID,
    };

    const newTweetId = await addTweetToVendorTweetHistory(tweetPayload, regionID, vendorID);
    sendEmailToAdminAccount({
      subject: `${vendorName} sent a new tweet`,
      template: 'admin.new-location',
      context: {
        text, newLocations, link: `${config.CLIENT_DOMAIN}/tweets/vendor/${vendorID}/tweet/${newTweetId}`, vendor,
      },
    });

    if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(tweetPayload); }

    await sharedOps.publishLocationUpdateAndClearCache({
      updatedTweet: {
        text, tweetID, twitterID, date,
      },
      newLocations,
      vendorID,
      twitterID,
      regionID,
    });
  });
};

module.exports = {
  receiveTweets,
  addLocationToVendorLocationHistory,
};



/// CUUURENTLY ON HANDLING INCOMING LOCATION DATA WITHOUT LOCATIONS!!!!