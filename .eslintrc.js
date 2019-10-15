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
        "files": ["*.spec.js"],
        "rules": {
            "no-unused-expressions": "off"
        }
      }
  ]
};
