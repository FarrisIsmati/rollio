module.exports = {
  "extends": "airbnb-base",
  "rules":{
    "linebreak-style": 0
  },
  "env": {
    "mocha": true
  },
  "overrides": [
      {
        "files": ["*.test.js", "*.spec.js"],
        "rules": {
            "no-unused-expressions": "off"
        }
      }
  ]
};
