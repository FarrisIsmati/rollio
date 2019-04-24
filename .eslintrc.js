module.exports = {
  "extends": "airbnb-base",
  "rules":{
    "linebreak-style": 0,
    "no-underscore-dangle": "off"
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
