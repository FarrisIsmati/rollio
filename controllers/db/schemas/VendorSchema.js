//DEPENDENCIES
const mongoose     = require('../connection');

//MENU SCHEMA
const MenuSchema = new mongoose.Schema({
  section : { type: String, required: true },
  items : {
    type: [
      {
        name : { type: String, required: true },
        price: { type: String, required: false },
        currency: { type: String, required: true }
      }
    ],
    required: true
  }
});

//COORDINATES SCHEMA
const CoordinatesSchema = new mongoose.Schema({
  coordinatesDate: { type: Date, default: Date.now, required: true },
  coordinates: {
    type: [ { type: Number, required: true } ],
    validate: [(val) => val.length <= 2, '{PATH} exceeds the limit of 2'],
    required: true
  }
})

//TWEET SCHEMA
const TweetSchema = new mongoose.Schema({
  tweetID : { type: String, required: true },
  createdAt : { type: Date, required: true },
  text : { type: String, required: true },
  userID : { type: String, required: true },
  userName : { type: String, required: true },
  userScreenName : { type: String, required: true },
  geolocation : { type: CoordinatesSchema, required: false }
})

//VENDOR SCHEMA
const VendorSchema = new mongoose.Schema({
  name : { type: String, required: true },
  type : { type: String, required: true, enum: ['mobileTruck', 'fixedTruck', 'cart', 'airstream'] },
  establishedDate : { type: Date, required: true },
  closedDate : { type: Date, required: false },
  description : { type: String, required: true },
  menu : {
    type: [MenuSchema],
    required: false
  },
  facebookRating : { type: String, required: false },
  yelpRating : { type: String, required: false },
  twitterID : { type: String, required: true },
  tweets : {
    type: [TweetSchema],
    required: false
  },
  recentCoordinates : {
    type: CoordinatesSchema,
    required: false
  },
  coordinatesHistory : {
    type: [CoordinatesSchema],
    required: false
  },
  dailyActive : { type: Boolean, required: true },
  address : { type: String, required: false },
  consecutiveDaysInactive : { type: Number, required: false },
  categories : { type: [ { type: String, required: true }], required: true },
  price : { type: String, required: true },
  regionID : { type: mongoose.Schema.Types.ObjectId, required: true },
  objCreatedAt : { type: Date, default: Date.now }
});

module.exports = {
  VendorSchema,
  MenuSchema,
  TweetSchema,
  CoordinatesSchema
};
