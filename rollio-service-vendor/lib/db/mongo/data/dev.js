// DEPENDENCIES
const { ObjectId } = require('mongoose').Types;
const faker = require('faker');
const moment = require('moment');

const tweet1Id = ObjectId();
const tweet2Id = ObjectId();
const tweet3Id = ObjectId();
const tweet4Id = ObjectId();
const tweet5Id = ObjectId();
const tweet6Id = ObjectId();
const tweet7Id = ObjectId();
const tweet8Id = ObjectId();
const tweet9Id = ObjectId();
const tweet1IdString = faker.random.word();
const tweet2IdString = faker.random.word();
const tweet3IdString = faker.random.word();
const tweet4IdString = faker.random.word();
const tweet5IdString = faker.random.word();
const tweet6IdString = faker.random.word();
const tweet7IdString = faker.random.word();
const tweet8IdString = faker.random.word();
const tweet9IdString = faker.random.word();
const location1Id = ObjectId();
const location2Id = ObjectId();
const location3Id = ObjectId();
const location4Id = ObjectId();
const location5Id = ObjectId();
const location6Id = ObjectId();
const location7Id = ObjectId();
const location8Id = ObjectId();
const location9Id = ObjectId();
const location10Id = ObjectId();
const vendor1Id = ObjectId();
const vendor2Id = ObjectId();
const vendor3Id = ObjectId();
const vendor4Id = ObjectId();
const vendor5Id = ObjectId();
const vendor6Id = ObjectId();
const vendor7Id = ObjectId();
const vendor8Id = ObjectId();
const region1Id = ObjectId();
const customerId = ObjectId();
const customerWithoutARegionId = ObjectId();
const adminId = ObjectId();
const vendorWithoutAVendorId = ObjectId();
const vendorWithAVendorId = ObjectId();
const secondVendorWithAVendorId = ObjectId();

// Fake twitterIDs
const getTwitterId = () => faker.random.number({ min: 100000000, max: 999999999 });
const vendor1TwitterID = getTwitterId();
const vendor2TwitterID = '2185580414';
const startDate = moment();
const endDate = moment(startDate).add(1, 'days');

module.exports = {
  vendors: [
    {
      _id: vendor1Id,
      regionID: region1Id,
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
      bannerImageLink: '',
      yelpId: '',
      price: '$$$$$',
      rating: 5,
      twitterID: '1053649707493404678',
      twitterUserName: 'dcfoodtrucks',
      twitterHandle: 'dcfoodtrucks1',
      tweetHistory: [tweet1Id],
      locationHistory: [location1Id],
      userLocationHistory: [location2Id],
      comments: [],
      consecutiveDaysInactive: 4,
      categories: ['Luxury', 'Caviar', 'Lobster', 'Michelan Star'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor2Id,
      regionID: region1Id,
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
      bannerImageLink: 'https://bit.ly/2wrzVnl',
      yelpId: 'balkanik-taste-food-truck-and-catering-rockville-3',
      twitterID: '2185580414',
      twitterUserName: 'Balkanik Taste',
      twitterHandle: 'balkaniktaste',
      tweetHistory: [tweet2Id],
      locationHistory: [location3Id],
      comments: [],
      consecutiveDaysInactive: 4,
      categories: ['Balkan', 'Mediterranean', 'Hearty', 'Meat'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor3Id,
      regionID: region1Id,
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
      bannerImageLink: 'https://bit.ly/2V5acvr',
      yelpId: '',
      twitterID: '204871288',
      twitterUserName: 'The Big Cheese',
      twitterHandle: 'bigcheesetruck',
      tweetHistory: [tweet3Id],
      locationHistory: [location4Id],
      comments: [],
      consecutiveDaysInactive: 4,
      categories: ['Cheese', 'Comfort', 'Hearty', 'Bread'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor4Id,
      regionID: region1Id,
      name: 'Chick-fil-A Mobile',
      type: 'mobileTruck',
      description: 'The #1 quick service food truck in the DMV!!',
      establishedDate: new Date('2012-03-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: 'https://www.chick-fil-a.com/',
      phoneNumber: '+18662322040',
      menu: [],
      profileImageLink: 'https://pbs.twimg.com/profile_images/583018351766548481/ldow70m5_400x400.jpg',
      bannerImageLink: 'https://pbs.twimg.com/profile_banners/540537070/1429019593/1500x500',
      yelpId: 'chick-fil-a-mobile-washington-4',
      twitterID: '540537070',
      tweetHistory: [tweet4Id],
      twitterUserName: 'Chick-fil-A Mobile',
      twitterHandle: 'ChickfilaMobile',
      locationHistory: [location5Id],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['Fast Food', 'American', 'Comfort Food', 'Meat', 'Chicken'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor5Id,
      regionID: region1Id,
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
      bannerImageLink: 'https://bit.ly/32aMiA8',
      yelpId: 'abunai-poke-washington',
      twitterID: '3333907289',
      twitterUserName: 'abunai',
      twitterHandle: 'hiabunai',
      tweetHistory: [tweet5Id],
      locationHistory: [location6Id],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['Hawaiian', 'Poke', 'Casual', 'Seafood'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor6Id,
      regionID: region1Id,
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
      bannerImageLink: 'https://bit.ly/38L8GTf',
      yelpId: 'arepa-crew-arlington',
      twitterID: '3183153867',
      twitterUserName: 'Arepa Crew',
      twitterHandle: 'ArepaCrew',
      tweetHistory: [tweet6Id],
      locationHistory: [location7Id],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['South American', 'Venezuelan', 'Arepa', 'Comfort Food', 'Street Food'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor7Id,
      regionID: region1Id,
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
      bannerImageLink: '',
      yelpId: 'astro-doughnuts-and-fried-chicken-washington',
      twitterID: '890432286',
      twitterUserName: 'astro doughnuts',
      twitterHandle: 'AstroDoughnuts',
      tweetHistory: [tweet7Id],
      locationHistory: [location8Id],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['American', 'Donuts', 'Fried Chicken', 'Comfort Food', 'Street Food'],
      approved: true,
      numTrucks: 1,
    },
    {
      _id: vendor8Id,
      regionID: region1Id,
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
      bannerImageLink: '',
      yelpId: 'ball-or-nothing-washington',
      twitterID: '488727238',
      tweetHistory: [tweet8Id],
      locationHistory: [location9Id, location10Id],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['Italian', 'Fried Chicken', 'Pasta', 'Meat'],
      approved: true,
      numTrucks: 2,
    },
    {
      regionID: region1Id,
      name: 'DC Foodtruck 2',
      type: 'mobileTruck',
      description: 'A truck for testing again',
      establishedDate: new Date('2018-11-01T12:00:00Z'),
      creditCard: 'y',
      email: '',
      website: '',
      phoneNumber: '+17039802219',
      menu: [],
      profileImageLink: '',
      bannerImageLink: '',
      yelpId: '',
      price: '$$$$$',
      rating: 5,
      twitterID: '1202752460424658944',
      twitterUserName: 'dcfoodtrucks2',
      twitterHandle: 'dcfoodtrucks2',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: 0,
      categories: ['Luxury', 'Caviar', 'Lobster', 'Michelan Star'],
      approved: true,
      numTrucks: 1,
    },
    {
      regionID: region1Id,
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
      bannerImageLink: '',
      yelpId: 'bbq-bus-smokehouse-and-catering-washington',
      twitterID: '197614798',
      twitterUserName: 'bbqbusdc',
      twitterHandle: 'bbqbusdc',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['Barbeque', 'American', 'Comfort Food', 'Meat'],
      approved: true,
      numTrucks: 1,
    },
    {
      regionID: region1Id,
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
      bannerImageLink: '',
      yelpId: 'capital-chicken-and-waffles-washington-2',
      twitterID: '836024018',
      twitterUserName: 'CapitalChickenWaffle',
      twitterHandle: 'CapitalCW',
      tweetHistory: [],
      locationHistory: [],
      userLocationHistory: [],
      comments: [],
      consecutiveDaysInactive: -1,
      categories: ['Fast Food', 'American', 'Comfort Food', 'Soul Food'],
      approved: true,
      numTrucks: 1,
    },
    // sloan's test account
    {
      _id: ObjectId('5e9b6be2169b1f125fa0744b'),
      numTrucks: 1,
      tweetHistory: [

      ],
      locationHistory: [

      ],
      userLocationHistory: [

      ],
      categories: [
        'Mexican',
      ],
      approved: true,
      consecutiveDaysInactive: 0,
      type: 'mobileTruck',
      name: "sloan's truck",
      description: 'asdf',
      email: 'fake@fake.com',
      website: 'sloan.com',
      phoneNumber: '9178808790',
      comments: [

      ],
      creditCard: 'y',
      twitterID: '1249003826520166401',
      regionID: region1Id,
    },
  ],
  regions: [
    {
      _id: region1Id,
      name: 'WASHINGTONDC',
      coordinates: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        address: 'Washington, D.C.',
        coordinates: { lat: 38.9072, long: 77.0369 },
        vendorID: ObjectId(),
      },
      location: 'Washington, D.C.',
      timezone: 'EST',
    },
  ],
  tweets: [
    {
      _id: tweet1Id,
      vendorID: vendor1Id,
      tweetID: tweet1IdString,
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are at Farragut Square',
      locations: [location1Id],
      usedForLocation: true,
    }, {
      _id: tweet2Id,
      vendorID: vendor2Id,
      tweetID: tweet2IdString,
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are in China Town',
      locations: [location3Id],
      usedForLocation: true,
    }, {
      _id: tweet3Id,
      vendorID: vendor3Id,
      tweetID: tweet3IdString,
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are in Rosslyn',
      locations: [location4Id],
      usedForLocation: true,
    }, {
      _id: tweet4Id,
      vendorID: vendor4Id,
      tweetID: tweet4IdString,
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'We are in Noma',
      locations: [location5Id],
      usedForLocation: true,
    }, {
      _id: tweet5Id,
      vendorID: vendor5Id,
      tweetID: tweet5IdString,
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'Farragut Wow Yes',
      locations: [location6Id],
      usedForLocation: true,
    }, {
      _id: tweet6Id,
      vendorID: vendor6Id,
      tweetID: tweet6IdString,
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'Farragut Yes',
      locations: [location7Id],
      usedForLocation: true,
    }, {
      _id: tweet7Id,
      vendorID: vendor7Id,
      tweetID: tweet7IdString,
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'Capital One Arena today',
      locations: [location8Id],
      usedForLocation: true,
    }, {
      _id: tweet8Id,
      vendorID: vendor8Id,
      tweetID: tweet8IdString,
      date: new Date('2018-04-12T12:10:00Z'),
      text: 'We are at 1. Capital One Arena today and 2. 1000 U St NW',
      locations: [location9Id, location10Id],
      usedForLocation: true,
    },
    {
      _id: tweet9Id,
      vendorID: vendor8Id,
      tweetID: tweet9IdString,
      date: new Date('2016-05-18T16:00:00Z'),
      text: 'Hows it going?!?!',
      locations: [],
      usedForLocation: false,
    },
  ],
  locations: [
    {
      _id: location1Id,
      locationDate: new Date('2018-11-01T12:00:00Z'),
      accuracy: 3,
      address: '123 Fake Street',
      city: 'Springfield',
      neighborhood: 'Little Russia',
      matchMethod: 'Tweet location',
      tweetID: tweet1IdString,
      coordinates: { lat: 39.2934, long: -77.1234 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor1Id,
    },
    {
      _id: location2Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: -4,
      address: '0185W 0800, Washington, DC 20006',
      city: 'dc',
      neighborhood: 'farragut square',
      matchMethod: 'User Input',
      tweetID: null,
      coordinates: { lat: 38.902033, long: -77.038995 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor1Id,
    },
    {
      _id: location3Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 3,
      address: '600 7th St NW',
      city: 'Washington, DC',
      neighborhood: 'Penn Quarter',
      matchMethod: 'Tweet location',
      coordinates: { lat: 38.897182, long: -77.022013 },
      tweetID: tweet2IdString,
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor2Id,
    },
    {
      _id: location4Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: 'Rosslyn, Virginia 22209',
      city: 'arlington',
      neighborhood: 'rosslyn',
      matchMethod: 'Tweet location',
      tweetID: tweet3IdString,
      coordinates: { lat: 38.897156, long: -77.07239 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor3Id,
    },
    {
      _id: location5Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: '700 G St NW, Washington, DC 20001',
      city: 'dc',
      neighborhood: 'chinatown',
      matchMethod: 'Tweet location',
      tweetID: tweet4IdString,
      coordinates: { lat: 38.898482, long: -77.021965 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor4Id,
    },
    {
      _id: location6Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: -4,
      address: '0185W 0800, Washington, DC 20006',
      city: 'dc',
      neighborhood: 'farragut square',
      tweetID: tweet5IdString,
      coordinates: { lat: 38.902033, long: -77.038995 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor5Id,
    },
    {
      _id: location7Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: -4,
      address: '0185W 0800, Washington, DC 20006',
      city: 'dc',
      neighborhood: 'farragut square',
      tweetID: tweet6IdString,
      coordinates: { lat: 38.902033, long: -77.038995 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor6Id,
    },
    {
      _id: location8Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: '700 G St NW, Washington, DC 20001',
      city: 'dc',
      neighborhood: 'chinatown',
      tweetID: tweet7IdString,
      coordinates: { lat: 38.898482, long: -77.021965 },
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor7Id,
    },
    {
      _id: location9Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: '700 G St NW, Washington, DC 20001',
      city: 'dc',
      neighborhood: 'chinatown',
      coordinates: { lat: 38.898482, long: -77.021965 },
      tweetID: tweet8IdString,
      startDate,
      endDate,
      overridden: false,
      truckNum: 1,
      vendorID: vendor8Id,
    },
    {
      _id: location10Id,
      locationDate: new Date('2018-04-12T12:10:00Z'),
      accuracy: 0,
      address: '1000 U St NW, Washington, DC 20001, USA',
      city: 'arlington',
      neighborhood: 'cardozo',
      matchMethod: 'Tweet location',
      tweetID: tweet8IdString,
      coordinates: {
        lat: 38.9166603,
        long: -77.0263105,
      },
      startDate,
      endDate,
      overridden: false,
      truckNum: 2,
      vendorID: vendor8Id,
    },
  ],
  users: [
    // sloan's test account
    {
      _id: ObjectId('5e9b6bc6169b1f125fa0744a'),
      type: 'vendor',
      email: 'fake@fake.com',
      twitterProvider: {
        id: '1249003826520166401',
        token: '1249003826520166401-3NpoC6U3gbskONAsE3etxK7nxZYrmZ',
        tokenSecret: 'Hi4rLo274z0C7OicbT2ONSg3mFGItM4bxHDWHE03wAxtx',
        username: 'fakeacc51947888',
        displayName: 'fake account',
      },
      status: 'ACTIVE',
      __v: 0,
      regionID: region1Id,
      vendorID: ObjectId('5e9b6be2169b1f125fa0744b'),
    },
    {
      _id: customerId,
      type: 'customer',
      email: 'customer@aol.com',
      twitterProvider: {
        id: getTwitterId(),
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
      status: 'ACTIVE',
      regionID: region1Id,
    },
    {
      _id: customerWithoutARegionId,
      type: 'customer',
      email: 'customerWithoutARegion@aol.com',
      twitterProvider: {
        id: getTwitterId(),
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
    },
    {
      _id: adminId,
      type: 'admin',
      email: 'admin@aol.com',
      twitterProvider: {
        id: getTwitterId(),
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
      status: 'ACTIVE',
      regionID: region1Id,
    },
    {
      _id: vendorWithAVendorId,
      type: 'vendor',
      email: 'vendorWithAVendorId@aol.com',
      twitterProvider: {
        id: vendor1TwitterID,
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
      status: 'ACTIVE',
      regionID: region1Id,
      vendorID: vendor1Id,
    },
    {
      _id: secondVendorWithAVendorId,
      type: 'vendor',
      email: 'vendor2WithAVendorId@aol.com',
      twitterProvider: {
        id: vendor2TwitterID,
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
      status: 'ACTIVE',
      regionID: region1Id,
      vendorID: vendor2Id,
    },
    {
      _id: vendorWithoutAVendorId,
      type: 'vendor',
      email: 'vendorWithoutAVendorId@aol.com',
      twitterProvider: {
        id: getTwitterId(),
        token: faker.random.word(),
        tokenSecret: faker.random.word(),
        username: faker.random.word(),
        displayName: faker.random.words(2),
      },
      status: 'ACTIVE',
      regionID: region1Id,
    },
  ],
};
