// DEPENDENCIES
const mongoose = require('../index');
const mUtilities = require('./utils');

// MENU SCHEMA
const MenuSchema = new mongoose.Schema({
  section: { type: String, required: true },
  items: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: String, required: false },
        currency: { type: String, required: true, enum: ['USD'] },
      },
    ],
    required: true,
  },
});

// LOCATION SCHEMA
const LocationSchema = new mongoose.Schema({
  locationDate: { type: Date, default: Date.now, required: true },
  accuracy: { type: Number, default: 0, required: true },
  address: { type: String, required: true },
  city: { type: String, required: false },
  neighborhood: { type: String, required: false },
  tweetID: { type: String, required: false },
  matchMethod: { type: String, required: false },
  coordinates: {
    type: [{ type: Number, required: true }],
    validate: [val => val.length <= 2, '{PATH} exceeds the limit of 2'],
    required: false,
  }
});

// TWEET SCHEMA
const TweetSchema = new mongoose.Schema({
  tweetID: { type: String, required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true },
  location: { type: LocationSchema, required: false },
  usedForLocation: { type: Boolean, default: false }
});

const CommentSchema = new mongoose.Schema({
  commentDate: { type: Date, default: Date.now, required: true },
  name: {
    type: String, required: true,
  },
  text: {
    type: String, required: true, minlength: 5, maxlength: 255,
  },
});

// VENDOR SCHEMA
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['mobileTruck', 'fixedTruck', 'cart', 'airstream'] },
  description: { type: String, required: true },
  establishedDate: { type: Date, required: false },
  // Future use case (If exists will not partake in any automated operations)
  closedDate: { type: Date, required: false },
  creditCard: { type: String, required: true, enum: ['y', 'n', 'u'] },
  email: { type: String, required: false },
  website: { type: String, required: false },
  phoneNumber: {
    type: String,
    validate: [number => mUtilities.phoneNumberValidate(number), 'Not a valid phone number.'],
    required: false,
  },
  menu: {
    type: [MenuSchema],
    required: false,
  },
  profileImageLink: {
    type: String,
    required: false,
  },
  // $$$
  price: { type: String, required: false },
  // Use Yelp API to search and find the ID
  yelpId: { type: String, required: false },
  yelpRating: { type: String, required: false },
  twitterID: { type: String, required: false },
  tweetHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  locationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  userLocationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  comments: {
    type: [CommentSchema],
    required: false,
  },
  // Means truck was active at some point in the current day
  dailyActive: { type: Boolean, required: true },
  consecutiveDaysInactive: { type: Number, required: true },
  // YOU NEED TO DEFINE HOW YOU DEFINE CATEGORIES
  categories: { type: [{ type: String, required: true }], required: true },
  regionID: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});


module.exports = {
  VendorSchema,
  MenuSchema,
  TweetSchema,
  CommentSchema,
  LocationSchema,
};
