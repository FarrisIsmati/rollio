//DEPENDENCIES
const Twitter             = require('twitter');
const LocationOperations     = require('../location/LocationOperations');
const mongoose            = require('../../db/schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//OPERATIONS
const regionOperations     = require('../../db/operations/regionOperations');
const vendorOperations     = require('../../db/operations/vendorOperations');

class TwitterClient {
  constructor(keys) {
    const { c_key, c_secret, a_key, a_secret, regionName } = keys;
    this.regionName = keys.regionName;

    this.client = new Twitter({
      consumer_key: c_key,
      consumer_secret: c_secret,
      access_token_key: a_key,
      access_token_secret: a_secret
    });
    this.locationOperation = new LocationOperations();
  }

  //Get userIDs from DB
  async getUserIds(regionName) {
    const regionID = await Region.findOne({
      "name": regionName
    }).then(res => res._id);

    const vendors = await Vendor.find({regionID});

    const userIDs = vendors.map(vendor => vendor.twitterID).join(',');

    return userIDs
  }

  //Pass in a set of tstIDs for testing (test db env wont have any data)
  async streamClient(event, tstIDs='1053649707493404678') {
    let userIDs;

    if (process.env.NODE_ENV === 'TEST') {
      userIDs = tstIDs;
    } else {
      userIDs = await this.getUserIds(this.regionName);
    }

    const stream = this.client.stream('statuses/filter', {follow: userIDs});

    stream.on('data', async e => {
      let formattedTweet = await this.tweetFormatter(e);
      event(formattedTweet);
    })

    stream.on('error', err => {
      throw err;
    })

    return stream;
  }

  async tweetFormatter(e) {
    const region = await regionOperations.getRegionByName(this.regionName);
    const vendor = await vendorOperations.getVendorByTwitterID(region._id, e.user.id_str);
    let payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text : e.text,
      screenName: e.user.screen_name,
      userName: e.user.name,
      userScreenName: e.user.screen_name
    }

    let place = null;
    if (e.place !== null) {
      place = {...e.place};
    }

    if (e.geo !== null) {
      payload.geolocation = await this.locationOperation.getGeolocation(e);
    }

    await vendorOperations.updateVendorPush({ regionID: region._id, vendorID: vendor._id, field: 'tweetsDaily', payload});

    //WEBSOCKETS FUNTIONALITY HERE
    return {...payload, place, twitterID: e.user.id_str};
  }
}

module.exports = TwitterClient;
