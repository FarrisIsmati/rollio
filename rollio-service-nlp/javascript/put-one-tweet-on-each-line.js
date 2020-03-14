const fs = require('fs');
const CreateFiles = fs.createWriteStream('./one-line-per-tweet.json', {
    flags: 'a' //flags: 'a' preserved old data
});

const tweets = require('./tweets');
CreateFiles.write('['+'\r\n');
tweets.forEach(tweet => {
    CreateFiles.write(`"${tweet.text.replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, "'")}",`+'\r\n');
});
CreateFiles.write(']');
