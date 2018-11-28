module.exports = {
  vendors: [
    // {
    //   "name": "Arepa Crew",
    //   "type": "mobileTruck",
    //   "description": "A taste of Venezuela for the Washington Metropolitan area!",
    //   "establishedDate": new Date("2015-04-01T12:00:00Z"),
    //   "creditCard": "y",
    //   "phoneNumber": "+17037255602",
    //   "price": "$$$",
    //   "yelpId": "arepa-crew-arlington", //after done look this shit up
    //   "yelpRating": "", //after done look up what it returns
    //   3183153867
    // }
    {
      "name": "DCMoblieVendor1",
      "type": "mobileTruck",
      "establishedDate": new Date("2016-05-18T16:00:00Z"),
      "description": "A yummy food truck",
      "menu": [{
        "section": "Meat",
        "items": [{"name": "Kabob", "price": "200", "currency": "USD"}]
      }],
      "twitterID": "1053649707493404678",
      "tweetsDaily": [
        {
          "tweetID": "laks3n",
          "createdAt": new Date("2016-05-18T16:00:00Z"),
          "text": "We are at Farragut Square",
          "userID": "YummiesMobile",
          "userName": "Yummies Mobile",
          "userScreenName": "YummiesMobile",
          "geolocation": {
            "locationDate": new Date("2018-04-12T12:10:00Z"),
            "accuracy": 3,
            "address": "28 Ist",
            "city": "Washington, DC",
            "neighborhood": "Farragut Square",
            "coordinates": [4.123, 1.522]
          }
        }
      ],
      "locationHistory": [
        {
          "locationDate": new Date("2018-04-12T12:10:00Z"),
          "accuracy": 3,
          "address": "28 Ist",
          "city": "Washington, DC",
          "neighborhood": "Farragut Square",
          "coordinates": [4.123, 1.522]
        }
      ],
      "userLocationHistory": [
        {
          "locationDate": new Date("2018-04-12T12:10:00Z"),
          "accuracy": -4,
          "address": "Lol Ist",
          "city": "Tysons, DC",
          "neighborhood": "Farragut Triangle",
          "coordinates": [4.123, 1.5222]
        }
      ],
      "comments": [
        {
          "commentDate": new Date("2018-04-12T12:10:00Z"),
          "text": "Hello this is very accurate"
        }
      ],
      "creditCard": "n",
      "phoneNumber": "+1202-638-0202",
      "city": "Tysons",
      "dailyActive": false,
      "consecutiveDaysInactive": 0,
      "categories": ["Meat", "Yummy", "American South West"],
      "regionID": null
    }, {
      "name": "CapitalCW",
      "type": "mobileTruck",
      "establishedDate": new Date("2017-05-18T16:00:00Z"),
      "description": "A sammies food truck",
      "menu": [{
        "section": "Meat",
        "items": [{"name": "Kabob", "price": "200", "currency": "USD"}]
      }],
      "twitterID": "836024018",
      "tweetsDaily": [
        {
          "tweetID": "cP3459s",
          "createdAt": new Date("2018-05-18T16:00:00Z"),
          "text": "We are at Michigan Square",
          "userID": "SammiesMobile",
          "userName": "Sammies Mobile",
          "userScreenName": "SammiesMobile",
          "geolocation": {
            "locationDate": new Date("2018-04-12T12:10:00Z"),
            "accuracy": 3,
            "address": "28 Ist",
            "city": "Washington, DC",
            "neighborhood": "Farragut Square",
            "coordinates": [4.123, 1.522]
          }
        }
      ],
      "locationHistory": [],
      "userLocationHistory": [],
      "locationAccuracy": 0,
      "comments": [
        {
          "commentDate": new Date("2018-04-12T12:10:00Z"),
          "text": "Hello this is very accurate"
        }
      ],
      "creditCard": "y",
      "phoneNumber": "+1703-628-0202",
      "dailyActive": false,
      "consecutiveDaysInactive": 0,
      "categories": ["Meat", "Mexican", "Chinese", "American South West"],
      "price": "$$$$",
      "regionID": null
    }, {
      "name": "Pepe",
      "type": "mobileTruck",
      "description": "Mobile Sandwiches by chef Jose Andres. Fresh-baked bread, long and thin like a flute, each sandwhich is made fresh on the spot, and includes such flavorful selections as the butifarra \"Burger\" (Fresh Pork, Roasted Peppers, and Alioli), Pollo Frito (Fried Chicken), Escalivada (Spanish-Style Roasted Vegetables), Jamon Serrano y Queso Manchego (The classic Spanish Ham and Cheese), and many more.",
      "creditCard": "y",
      "email": "events@pepethefoodtruck.com",
      "website": "https://www.joseandrescatering.com/pepe/",
      "phoneNumber": "+1202-638-0202",
      "yelpId": "xF5cphbxvMKNdMRNSWAzkQ",
      "twitterID": "472280764",
      "tweetsDaily": [],
      "locationHistory": [],
      "userLocationHistory": [],
      "locationAccuracy": 0,
      "comments": [],
      "dailyActive": false,
      "consecutiveDaysInactive": 0,
      "categories": ["spanish", "sandwhich", "traditional"],
      "regionID": null
    }
  ],
  regions: [
    {
      "name": "WASHINGTONDC",
      "totalDailyActive": 2,
      "coordinates": {
        "locationDate": new Date("2018-04-12T12:10:00Z"),
        "address": "Washington, D.C.",
        "coordinates": [38.9072, 77.0369]
      },
      "location": "Washington, D.C.",
      "timezone": "EST"
    }
  ]
}
