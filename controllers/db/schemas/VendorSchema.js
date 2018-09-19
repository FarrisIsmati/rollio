//DEPENDENCIES
const mongoose          = require('../connection');
const validationUtil    = require('./ValidationUtils');

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

const CommentSchema = new mongoose.Schema({
  commentDate: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true, minlength: 5, maxlength: 255 }
})

//VENDOR SCHEMA
const VendorSchema = new mongoose.Schema({
  name : { type: String, required: true },
  type : { type: String, required: true, enum: ['mobileTruck', 'fixedTruck', 'cart', 'airstream'] },
  description : { type: String, required: true },
  establishedDate : { type: Date, required: false },
  closedDate : { type: Date, required: false }, //Future use case (If exists will not partake in any automated operations)
  creditCard : { type: String, required: true, enum: ['y','n','u'] },
  email : { type: String, required: false },
  website : { type: String, required: false },
  phoneNumber: {
    type: String,
    validate: [number => validationUtil.phoneNumberValidate(number), 'Not a valid phone number.'],
    required: true
  },
  menu : {
    type: [MenuSchema],
    required: false
  },
  price : { type: String, required: false },
  yelpId : { type: String, required: false }, //Use Yelp API to search and find the ID
  yelpRating : { type: String, required: false },
  twitterId : { type: String, required: false },
  tweetsDaily : {
    type: [TweetSchema],
    required: false
  },
  coordinatesHistory : {
    type: [CoordinatesSchema],
    required: true
  },
  locationAccuracy : { type: Number, required: true },
  municipality : { type: String, required: false },
  comments : {
    type: [CommentSchema],
    required: false
  },
  dailyActive : { type: Boolean, required: true }, //Means truck was active at some point in the current day
  consecutiveDaysInactive : { type: Number, required: true },
  categories : { type: [ { type: String, required: true }], required: true }, //YOU NEED TO DEFINE HOW YOU DEFINE CATEGORIES
  regionID : { type: mongoose.Schema.Types.ObjectId, required: true },
  objCreatedAt : { type: Date, default: Date.now }
});


module.exports = {
  VendorSchema,
  MenuSchema,
  TweetSchema,
  CommentSchema,
  CoordinatesSchema
};
