// DEPENDENCIES
const moment = require('moment');
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
  locationDate: { type: Date, default: () => Date.now, required: true },
  accuracy: { type: Number, default: 0, required: true },
  address: { type: String, required: true },
  city: { type: String, required: false },
  neighborhood: { type: String, required: false },
  // possibly replace this with a reference to the tweet in the Tweet collection
  // possibly make required if matchMethod is Tweet Location or Manual from Tweet
  tweetID: { type: String, required: false },
  startDate: { type: Date, default: () => new Date() },
  endDate: {
    type: Date,
    default: () => moment(new Date()).endOf('day').toDate(),
  },
  matchMethod: {
    type: String, enum: ['Tweet location', 'User Input', 'Manual from Tweet'], default: 'Tweet location', required: false,
  },
  overriden: { type: Boolean, default: false },
  coordinates: {
    type: [{ type: Number, required: true }],
    validate: [
      { validator: val => val.length === 2, msg: 'There should be exactly two coordinates (lat and long)' },
      {
        validator: (val) => {
          const lat = val[0];
          const long = val[1];
          const latInCorrectRange = lat >= -90 && lat <= 90;
          const longInCorrectRange = long >= -180 && long <= 180;
          return latInCorrectRange && longInCorrectRange;
        },
        msg: 'Latitude and longitude are not in the correct ranges',
      },
    ],
    required: false,
  },
});

// TWEET SCHEMA
const TweetSchema = new mongoose.Schema({
  tweetID: { type: String, required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false },
  vendorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  usedForLocation: { type: Boolean, default: false },
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
  bannerImageLink: {
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
  // TODO: here
  dailyActive: { type: Boolean, required: true },
  consecutiveDaysInactive: { type: Number, required: true },
  // YOU NEED TO DEFINE HOW YOU DEFINE CATEGORIES
  categories: { type: [{ type: String, required: true }], required: true },
  regionID: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});


module.exports = {
  VendorSchema,
  MenuSchema,
  TweetSchema,
  CommentSchema,
  LocationSchema,
};
