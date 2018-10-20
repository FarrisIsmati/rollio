//DEPENDENCIES
const Twitter             = require('../twitter/TwitterClient');

class DataOperations {
  constructor() {
    this.twitterClient = new Twitter({
      c_key: process.env.TWITTER_CONSUMER_KEY,
      c_secret: process.env.TWITTER_CONSUMER_SECRET,
      a_key: process.env.TWITTER_ACCESS_TOKEN,
      a_secret: process.env.TWITTER_ACCESS_SECRET,
      regionID: 'WASHINGTONDC'
    });

    this.runOperations();
  }

  runOperations() {
    this.twitterClient.streamClient(event => {
      console.log(event.text);
    });
  }
}

module.exports = DataOperations;
