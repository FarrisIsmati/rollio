//DEPENDENCIES
const mongoose     = require('../connection.js')

//VENDOR SCHEMA
const VendorSchema = new mongoose.Schema({
  name : { type: String, required: true },
  type: { type: String, required: true },
  establishedDate: { type: Date, required: true },
  closedDate: { type: Date, required: false },
  description: { type: String, required: true },
  //menu
  facebookRating: { type: String, required: false },
  yelpRating: { type: String, required: false },
  twitterID: { type: String, required: true },
  //tweets
  //coordinates
  //coordinatesHistory
  dailyActive: { type: Boolean, required: true },
  address: { type: String, required: false },
  consecutiveDaysInactive: { type: Number, required: false },
  //categories
  price: { type: String, required: true },
  //regionID
  objCreatedAt: { type: Date, default: Date.now }
});

//SETS OBJECT CREATED AT DATE TIME
VendorSchema.pre('save', next => {
  const now = new Date();

  if(!this.createdAt) {
    this.objCreatedAt = now;
  }

  return next();
});

module.exports = mongoose.model('book', BookSchema);
