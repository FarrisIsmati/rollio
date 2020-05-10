const { ObjectId } = require('mongoose').Types;

const washingtonDCId = ObjectId();

module.exports = {
  vendors: [
    {
      name: 'Pepe',
      type: 'mobileTruck',
      description: 'Mobile Sandwiches by chef Jose Andres. Fresh-baked bread, long and thin like a flute, each sandwich is made fresh on the spot, and includes such flavorful selections as the butifarra "Burger" (Fresh Pork, Roasted Peppers, and Alioli), Pollo Frito (Fried Chicken), Escalivada (Spanish-Style Roasted Vegetables), Jamon Serrano y Queso Manchego (The classic Spanish Ham and Cheese), and many more.',
      creditCard: 'y',
      email: 'events@pepethefoodtruck.com',
      website: 'https://www.joseandrescatering.com/pepe/',
      phoneNumber: '+1202-638-0202',
      price: '$$',
      yelpId: 'xF5cphbxvMKNdMRNSWAzkQ',
      twitterID: 'https://twitter.com/pepefoodtruck?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor', // Dont know what it is yet!
      tweetHistory: [],
      locationHistory: [],
      locationAccuracy: 0,
      comments: [],
      consecutiveDaysInactive: 0,
      categories: ['spanish', 'sandwich', 'traditional'],
      regionID: washingtonDCId,
    },
  ],
  regions: [
    {
      _id: washingtonDCId,
      name: 'WASHINGTONDC',
      coordinates: {
        locationDate: new Date('2018-04-12T12:10:00Z'),
        address: 'Washington, D.C.',
        coordinates: [38.9072, 77.0369],
        vendorID: ObjectId(),
      },
      location: 'Washington, D.C.',
      timezone: 'EST',
    },
  ],
  users: [
    {
      _id: ObjectId(),
      type: 'admin',
      email: 'sloan.holzman@gmail.com',
      twitterProvider: {
        id: '144925094',
        token: '144925094-VgHtzdoYnq89JahIlJnx1A7iWB7ERyISahvoVG6S',
        tokenSecret: 'Mts2kwlBHxuAR7ePhmRUdmtSRcNDp0aHBDUUusU0lQQEu',
        username: 'sloanholzman',
        displayName: 'Sloan Holzman',
      },
      __v: 0,
      regionID: washingtonDCId,
    },
  ],
  // TODO: add farris as an admin, too
};
