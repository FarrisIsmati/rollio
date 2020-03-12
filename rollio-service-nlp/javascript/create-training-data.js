const fs = require('fs');
const CreateFiles = fs.createWriteStream('./full-training-data-3.txt', {
    flags: 'a' //flags: 'a' preserved old data
});
const INSERT = 'xxx';
const tweets = require('./one-line-per-tweet');

function getIndicesOf(searchStr, str) {
    const re = new RegExp(str,'gi');
    const strLength = str.length;
    const indices = [];
    while (re.exec(searchStr)){
        const previousMatches = indices.length;
        indices.push(re.lastIndex - (previousMatches * strLength) - strLength);
    }
    return indices
}

// TODO: update to have different entry type
tweets.forEach(tweet => {
    const entityIndices = getIndicesOf(tweet, INSERT);
    const finalTweet = tweet.replace(/xxx/g, '');
    const entities = entityIndices.reduce((acc, entityIndex, idx) => {
        if (idx%2) {
            acc.push(`(${entityIndices[idx - 1]}, ${entityIndices[idx]}, 'TRUCK_LOCATION')`)
        }
        return acc;
    }, []);
    CreateFiles.write(`("${finalTweet}", {'entities': [${entities.join(', ')}]}),`+'\r\n');
});
