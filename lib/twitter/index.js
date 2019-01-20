//ENV
require('dotenv').config();
//DEPENDENCIES
const Twitter = require('twitter');
//const LocationOperations = require('../location/LocationOperations');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

const twitterOps = {
  streamClient : async function(event, vendorList, tstIDs='1053649707493404678') {
    console.log(vendorList)
    // let userIDs;
    // if (process.env.NODE_ENV === 'TEST') {
    //   userIDs = tstIDs;
    // } else {
    //   userIDs = vendorList.map(vendor => vendor.twitterID).join(',');
    // }
    // const stream = client.stream('statuses/filter', {follow: userIDs});
    // stream.on('data', async e => {
    //   let formattedTweet = await this.tweetFormatter(e);
    //   event(formattedTweet);
    // })
    // stream.on('error', err => {
    //   throw err;
    // })
    // return stream;
  },
  tweetFormatter : async function(e) {
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
    return {...payload, place, twitterID: e.user.id_str};
  }
}

module.exports = twitterOps;
