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
  address : { type: String, required: false },
  coordinates: {
    type: [ { type: Number, required: true } ],
    validate: [(val) => val.length <= 2, '{PATH} exceeds the limit of 2'],
    required: true
  }
});

//TWEET SCHEMA
const TweetSchema = new mongoose.Schema({
  tweetID : { type: String, required: true },
  createdAt : { type: Date, required: true },
  text : { type: String, required: true },
  userID : { type: String, required: true },
  userName : { type: String, required: true },
  userScreenName : { type: String, required: true },
  geolocation : { type: CoordinatesSchema, required: false }
});

const LocationAccuracyCommentSchema = new mongoose.Schema({
  commentDate: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true, maxlength: 255, minLength: 5 }
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
  tweetsDaily : {
    type: [TweetSchema],
    required: false
  },
  coordinatesHistory : {
    type: [CoordinatesSchema],
    required: true
  },
  locationAccuracy : { type: Number, required: true },
  locationAccuracyComments : {
    type: [LocationAccuracyCommentSchema],
    required: false
  },
  municipality : { type: String, required: false },
  dailyActive : { type: Boolean, required: true },
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
  LocationAccuracyCommentSchema,
  CoordinatesSchema
};
