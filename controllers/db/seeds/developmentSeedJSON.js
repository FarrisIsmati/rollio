module.exports = {
  vendors: [
    {
      "name": "Yummies",
      "type": "mobileTruck",
      "establishedDate": new Date("2016-05-18T16:00:00Z"),
      "description": "A yummy food truck",
      "menu": [{
        "section": "Meat",
        "items": [{"name": "Kabob", "price": "200", "currency": "USD"}]
      }],
      "facebookRating": "8",
      "yelpRating": "8",
      "twitterID": "abcx92n0dj2mmd9008284",
      "tweetsDaily": [
        {
          "tweetID": "laks3n",
          "createdAt": new Date("2016-05-18T16:00:00Z"),
          "text": "We are at Farragut Square",
          "userID": "YummiesMobile",
          "userScreenName": "YummiesMobile",
          "geolocation": {
            "coordinatesDate": new Date("2018-04-12T12:10:00Z"),
            "coordinates": [4.123, 1.522]
          }
        }
      ],
      "coordinatesHistory": [
        {
          "coordinatesDate": new Date("2018-04-12T12:10:00Z"),
          "address": "28 Ist",
          "coordinates": [4.123, 1.522]
        }
      ],
      "dailyActive": false,
      "consecutiveDaysInactive": 0,
      "categories": ["Meat", "Yummy", "American South West"],
      "price": "$$",
      "regionID": null
    },    {
          "name": "Sammies",
          "type": "mobileTruck",
          "establishedDate": new Date("2017-05-18T16:00:00Z"),
          "description": "A sammies food truck",
          "menu": [{
            "section": "Meat",
            "items": [{"name": "Kabob", "price": "200", "currency": "USD"}]
          }],
          "facebookRating": "5",
          "yelpRating": "5",
          "twitterID": "a2cx92nzdj2mmd9008284",
          "tweetsDaily": [
            {
              "tweetID": "cP3459s",
              "createdAt": new Date("2018-05-18T16:00:00Z"),
              "text": "We are at Michigan Square",
              "userID": "SammiesMobile",
              "userScreenName": "SammiesMobile",
              "geolocation": {
                "coordinatesDate": new Date("2018-02-12T12:10:00Z"),
                "coordinates": [2.4123, 1.522]
              }
            }
          ],
          "coordinatesHistory": [
            {
              "coordinatesDate": new Date("2018-04-12T12:10:00Z"),
              "address": "22nd Ist",
              "coordinates": [4.223, 1.512]
            }
          ],
          "dailyActive": false,
          "consecutiveDaysInactive": 0,
          "categories": ["Meat", "Mexican", "American South West"],
          "price": "$$$$",
          "regionID": null
        }
  ],
  regions: [
    {
      "name": "WASHINGTONDC",
      "location": "Washington, D.C.",
      "timezone": "EST"
    }
  ]
}
