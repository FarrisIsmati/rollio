/* eslint-disable no-console */
// ENV
require('dotenv').config();

// DEPENDENCIES
const Twitter = require('twitter');

// LIB
const tweetParser = require('./parse/tweet-parser');
const locationOps = require('../bin/location-ops');
const sendParsedTweet = require('../messaging/send/send-parsed-tweet');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

const twitter = {
  stream: null,
  vendorList: '',
  connectAtt: 0,
  backoffTime: 3,
  async streamClient(vendorList, tstIDs = '1053649707493404678') {
    if (process.env.NODE_ENV === 'TEST') {
      this.vendorList = tstIDs;
    } else {
      this.vendorList = vendorList;
      console.log(`Recieved VendorIDs, length: ${this.vendorList.split(',').length}`);
    }

    this.connect();

    return this.stream;
  },
  async connect(tstIDs = '1053649707493404678') {
    if (!this.vendorList.length) {
      this.vendorList = tstIDs;
    }

    this.stream = client.stream('statuses/filter', { follow: this.vendorList });

    this.connectAtt += 1;

    this.stream.on('data', async (e) => {
      const formattedTweet = await this.tweetFormatter(e);
      const parsedTweet = tweetParser.scanAddress(formattedTweet);
      console.log(parsedTweet);
      await sendParsedTweet(parsedTweet);
    });

    // Exponential backoff upon failure of stream up to 8 retries before shutting down
    this.stream.on('error', (err) => {
      this.stream.destroy();
      if (this.connectAtt < 8) {
        console.log('CONNECT AGAIN');
        const time = this.backoff(this.backoffTime);
        console.log(`time: ${time}`);
        console.log(`attempts: ${this.connectAtt}`);
        this.connect();
      } else {
        throw err;
      }
    });
  },
  backoff(time) {
    const milliseconds = time * 1000;
    const start = (new Date()).getTime();
    this.backoffTime *= 2;
    while (((new Date()).getTime() - start) < milliseconds) {
      // Elapse time
    }
    return (new Date()).getTime() - start;
  },
  async tweetFormatter(e) {
    const payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text: e.text,
      screenName: e.user.screen_name,
      userName: e.user.name,
      userScreenName: e.user.screen_name,
    };
    let place = null;
    if (e.place !== null) {
      place = { ...e.place };
    }
    if (e.geo !== null) {
      payload.geolocation = await locationOps.reverseGeolocation(e);
    }
    return { ...payload, place, twitterID: e.user.id_str };
  },
  // Strictly for testing sample twitter data
  test: async () => {
    // eslint-disable-next-line global-require
    const sampleData = require('./data/tweet-data-sample');
    const resultsPromise = [];

    for (let i = 0; i < sampleData.length; i += 1) {
      const tweet = sampleData[i];
      resultsPromise.push(tweetParser.scanAddress(tweet));
    }

    const results = await Promise.all(resultsPromise);

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
      for (let i = 0; i < results.length; i += 1) {
        console.log(results[i]);
      }
    }

    return results;
  },
};

module.exports = twitter;
