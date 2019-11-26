const { ObjectId } = require('mongoose').Types;

const tweet1Id = ObjectId();
const tweet2Id = ObjectId();
const tweet3Id = ObjectId();
const tweet4Id = ObjectId();
const tweet5Id = ObjectId();
const location1Id = ObjectId();
const location2Id = ObjectId();
const location3Id = ObjectId();
const location4Id = ObjectId();

module.exports = {
  vendors: [
    {
      name: 'DC Foodtruck 1',
      type: 'mobileTruck',
      description: 'A truck for testing',
      establishedDate: new Date('2018-11-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: '',
      phoneNumber: '+17039802219',
      menu: [],
      profileImageLink: '',
      yelpId: '',
      price: '$$$$$',
      rating: 5,
      twitterID: '1053649707493404678',
      tweetHistory: [tweet1Id],
      locationHistory: [location1Id],
      userLocationHistory: [location2Id],
      comments: [],
      dailyActive: true,
      consecutiveDaysInactive: 4,
      categories: ['Luxury', 'Caviar', 'Lobster', 'Michelan Star'],
    }, {
      name: 'Abunai',
      type: 'mobileTruck',
      description: 'Modern Hawaiian cuisine in D.C. Catering, pop-ups, food truck, and UberEATS!',
      establishedDate: new Date('2016-01-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'http://www.abunaipoke.com/',
      phoneNumber: '+12028389718',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/1109249231263592448/YXA1EgMG_400x400.jpg',
      yelpId: 'abunai-poke-washington',
      twitterID: '3333907289',
      tweetHistory: [tweet5Id],
      locationHistory: [location2Id],
      userLocationHistory: [],
      comments: [],
      dailyActive: true,
      consecutiveDaysInactive: -1,
      categories: ['Hawaiian', 'Poke', 'Casual', 'Seafood'],
    }, {
      name: 'Arepa Crew',
      type: 'mobileTruck',
      description: 'A taste of Venezuela for the Washington Metropolitan area!',
      establishedDate: new Date('2015-04-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: '',
      phoneNumber: '+17037255602',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/595430292627787777/aQF9HgVs_400x400.jpg',
      yelpId: 'arepa-crew-arlington',
      twitterID: '3183153867',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      dailyActive: false,
      consecutiveDaysInactive: -1,
      categories: ['South American', 'Venezuelan', 'Arepa', 'Comfort Food', 'Street Food'],
    }, {
      name: 'Astro Donuts',
      type: 'mobileTruck',
      description: "Fried chicken and doughnuts in the nation's capital, Falls Church, VA and a pretty awesome food truck on a corner near you. NOW OPEN in Los Angeles!",
      establishedDate: new Date('2012-10-01T12:00:00Z'),
      creditCard: 'y',
      email: 'info@astrodoughnuts.com',
      website: 'http://www.astrodoughnuts.com',
      phoneNumber: '+12028095565',
      menu: [],
      profileImageLink: '',
      yelpId: 'astro-doughnuts-and-fried-chicken-washington',
      twitterID: '890432286',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      dailyActive: false,
      consecutiveDaysInactive: -1,
      categories: ['American', 'Donuts', 'Fried Chicken', 'Comfort Food', 'Street Food'],
    }, {
      name: 'Ball or Nothing',
      type: 'mobileTruck',
      description: 'Balls on Wheels hitting a spot near you. We have something for everyone. If everyone likes balls.',
      establishedDate: new Date('2012-01-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'https://www.ballornothingdc.com/',
      phoneNumber: '+12026818760',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/730417770039414785/xOgGK3FM_400x400.jpg',
      yelpId: 'ball-or-nothing-washington',
      twitterID: '488727238',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      dailyActive: false,
      consecutiveDaysInactive: -1,
      categories: ['Italian', 'Fried Chicken', 'Pasta', 'Meat'],
    }, {
      name: 'BBQ Bus',
      type: 'mobileTruck',
      description: 'Catch us curbside, order delivery or visit us at new Smokehouse, our job is same: Fill you up on eats you love surrounded by ones you care for most.',
      establishedDate: new Date('2010-10-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'http://www.bbqbusdc.com',
      phoneNumber: '+12022888700',
      menu: [],
      profileImageLink: '',
      yelpId: 'bbq-bus-smokehouse-and-catering-washington',
      twitterID: '197614798',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      dailyActive: false,
      consecutiveDaysInactive: -1,
      categories: ['Barbeque', 'American', 'Comfort Food', 'Meat'],
    }, {
      name: 'Capital Chicken & Waffles',
      type: 'mobileTruck',
      description: "The DC area's first & only chicken & waffles food truck! Stay tuned for updates, locations, coupons & much, much more. We are open every day: 8am to 10pm.",
      establishedDate: new Date('2012-09-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'https://www.capitalcw.com/',
      phoneNumber: '',
      menu: [],
      profileImageLink: '',
      yelpId: 'capital-chicken-and-waffles-washington-2',
      twitterID: '836024018',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      dailyActive: false,
      consecutiveDaysInactive: -1,
      categories: ['Fast Food', 'American', 'Comfort Food', 'Soul Food'],
    }, {
      name: 'Chick-fil-A Mobile',
      type: 'mobileTruck',
      description: 'The #1 quick service food truck in the DMV!!',
      establishedDate: new Date('2012-03-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'https://www.chick-fil-a.com/',
      phoneNumber: '+18662322040',
      menu: [],
      profileImageLink: '',
      yelpId: 'chick-fil-a-mobile-washington-4',
      twitterID: '540537070',
      tweetHistory: [tweet4Id],
      locationHistory: [location4Id],
      userLocationHistory: [],
      comments: [],
      dailyActive: true,
      consecutiveDaysInactive: -1,
      categories: ['Fast Food', 'American', 'Comfort Food', 'Meat', 'Chicken'],
    }, {
      name: 'Balkanik Taste',
      type: 'mobileTruck',
      description: 'Balkanik Taste is a family owned and operated business. We are 100% dedicated to our customers, giving them the best services in the Metro Washington area.',
      establishedDate: new Date('2013-11-01T12:00:00Z'),
      creditCard: 'y',
      email: 'balkaniktaste@gmail.com',
      website: 'https://www.balkaniktaste.com',
      phoneNumber: '+12404217267',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/974624453593362432/5fabVcBz_400x400.jpg',
      yelpId: 'balkanik-taste-food-truck-and-catering-rockville-3',
      twitterID: '2185580414',
      tweetHistory: [tweet2Id],
      locationHistory: [location3Id],
      comments: [],
      dailyActive: true,
      consecutiveDaysInactive: 4,
      categories: ['Balkan', 'Mediterranean', 'Hearty', 'Meat'],
    }, {
      name: 'The Big Cheese',
      type: 'mobileTruck',
      description: 'Purveyors of fine grilled cheeses since 2010',
      establishedDate: new Date('2010-10-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'https://www.bigcheesetruck.com',
      phoneNumber: '',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/3617068539/0eff682e21f6f495990e3a617c15b66d_400x400.jpeg',
      yelpId: '',
      twitterID: '204871288',
      tweetHistory: [tweet3Id],
      locationHistory: [location3Id],
      comments: [],
      dailyActive: true,
      consecutiveDaysInactive: 4,
      categories: ['Cheese', 'Comfort', 'Hearty', 'Bread'],
    },
  ],
  regions: [
    {
      name: 'WASHINGTONDC',
      coordinates: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        address: 'Washington, D.C.',
        coordinates: [38.9072, 77.0369],
      },
      location: 'Washington, D.C.',
      timezone: 'EST',
    },
  ],
  tweets: [
    {
      _id: tweet1Id,
      tweetID: 'laks3n',
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are at Farragut Square',
      location: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        accuracy: 3,
        address: '28 Ist',
        city: 'Washington, DC',
        neighborhood: 'Farragut Square',
        coordinates: [4.123, 1.522],
      },
      usedForLocation: false,
    }, {
      _id: tweet2Id,
      tweetID: '125fake',
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are in China Town',
      location: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        accuracy: 3,
        address: '600 7th St NW',
        city: 'Washington, DC',
        neighborhood: 'Penn Quarter',
        coordinates: [38.897182, -77.022013],
      },
      usedForLocation: false,
    }, {
      _id: tweet3Id,
      tweetID: '124fake',
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are in China Town',
      location: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        accuracy: 3,
        address: '600 7th St NW',
        city: 'Washington, DC',
        neighborhood: 'Penn Quarter',
        coordinates: [38.897182, -77.022013],
      },
      usedForLocation: false,
    }, {
      _id: tweet4Id,
      tweetID: '135Fake',
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'Rosslyn Today Yes',
      location: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        accuracy: 0,
        address: 'Rosslyn, Virginia 22209',
        city: 'arlington',
        neighborhood: 'rosslyn',
        coordinates: [38.897156, -77.07239],
      },
      usedForLocation: false,
    }, {
      _id: tweet5Id,
      tweetID: '136Fake',
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'Rosslyn Today Yes',
      location: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        accuracy: -4,
        address: '0185W 0800, Washington, DC 20006',
        city: 'dc',
        neighborhood: 'farragut square',
        coordinates: [38.902033, -77.038995],
      },
      usedForLocation: false,
    }
  ],
  locations: [
    {
      _id: location1Id,
      locationDate: new Date('2018-11-01T12:00:00Z'),
      accuracy: 3,
      address: '123 Fake Street',
      city: 'Springfield',
      neighborhood: 'Little Russia',
      matchMethod: 'User Input',
      tweetID: null,
      coordinates: [39.2934, -77.1234],
    }, {
      _id: location2Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: -4,
      address: '0185W 0800, Washington, DC 20006',
      city: 'dc',
      neighborhood: 'farragut square',
      matchMethod: 'Tweet location',
      tweetID: '125fake',
      coordinates: [38.902033, -77.038995],
    }, {
      _id: location3Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 3,
      address: '600 7th St NW',
      city: 'Washington, DC',
      neighborhood: 'Penn Quarter',
      matchMethod: 'Tweet location',
      tweetID: '124fake',
      coordinates: [38.897182, -77.022013],
    }, {
      _id: location4Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: 'Rosslyn, Virginia 22209',
      city: 'arlington',
      neighborhood: 'rosslyn',
      matchMethod: 'Tweet location',
      tweetID: '135Fake',
      coordinates: [38.897156, -77.07239],
    },
  ],
};
