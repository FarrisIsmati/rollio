//DEPENDENCIES
const Twitter             = require('twitter');
const mongoose            = require('../../db/schemas/AllSchemas');

//SCHEMA
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

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
  }

  //Get userIDs from DB
  async getUserIds(regionName) {
    const regionID = await Region.findOne({
      "regionName": regionName
    }).then(res => res._id);

    const vendors = await Vendor.find({regionID}).then(res => res);

    const userIDs = vendors.map(vendor => vendor.twitterID).join(',');

    return userIDs
  }

  //Pass in a set of tstIDs for testing (test db env wont have any data)
  async streamClient(tstIDs) {
    let userIDs;

    if (process.env.NODE_ENV === 'TEST') {
      userIDs = tstIDs;
    } else {
      userIDs = await this.getUserIds(this.regionName);
    }

    const stream = this.client.stream('statuses/filter', {follow: userIDs});

    stream.on('data', event => {
      console.log(event);
    })

    stream.on('error', err => {
      throw err;
    })
  }
}

module.exports = TwitterClient;
