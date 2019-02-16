//DEPENDENCIES
const mq = require('../index');

const sendParsedTweet = async tweet => {
  await mq.send('parsedTweets', tweet);
}

module.exports = sendParsedTweet;
