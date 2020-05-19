// DEPENDENCIES
const moment = require('moment');
const mongoose = require('../index');
const mUtilities = require('./utils');

const { ObjectId } = mongoose.Schema.Types;

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
  vendorID: { type: ObjectId, required: true },
  locationDate: { type: Date, default: Date.now, required: true },
  accuracy: { type: Number, default: 0, required: true },
  address: { type: String, required: true },
  city: { type: String, required: false },
  neighborhood: { type: String, required: false },
  // possibly replace this with a reference to the tweet in the Tweet collection
  // possibly make required if matchMethod is Tweet Location or Manual from Tweet
  tweetID: { type: String, required: false },
  startDate: { type: Date, default: Date.now },
  endDate: {
    type: Date,
    default() { return moment(new Date()).endOf('day').toDate(); },
  },
  matchMethod: {
    type: String, enum: ['Tweet location', 'User Input', 'Vendor Input', 'Manual from Tweet'], default: 'Tweet location', required: false,
  },
  overridden: { type: Boolean, default: false },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      validate: [
        {
          validator: val => val >= -90 && val <= 90,
          msg: 'Latitude is not in the correct range',
        },
      ],
    },
    long: {
      type: Number,
      required: true,
      validate: [
        {
          validator: val => val >= -180 && val <= 180,
          msg: 'Longitude is not in the correct range',
        },
      ],
    },
  },
  truckNum: { type: Number, default: 1 },
});

// TWEET SCHEMA
const TweetSchema = new mongoose.Schema({
  tweetID: { type: String, required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true },
  locations: [{ type: ObjectId, ref: 'Location', required: false }],
  vendorID: { type: ObjectId, ref: 'Vendor', required: true },
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
  numTrucks: { type: Number, default: 1 },
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
  tweetHistory: [{ type: ObjectId, ref: 'Tweet' }],
  locationHistory: [{ type: ObjectId, ref: 'Location' }],
  userLocationHistory: [{ type: ObjectId, ref: 'Location' }],
  comments: {
    type: [CommentSchema],
    required: false,
  },
  // Means truck was active at some point in the current day
  // TODO: probably get rid of consecutiveDaysInactive, too
  consecutiveDaysInactive: { type: Number, required: true },
  // YOU NEED TO DEFINE HOW YOU DEFINE CATEGORIES
  categories: { type: [{ type: String, required: true }], required: true },
  regionID: { type: ObjectId, required: true },
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
