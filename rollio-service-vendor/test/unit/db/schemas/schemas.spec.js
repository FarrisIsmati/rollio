// DEPENDENCIES
const chai = require('chai');
const asserttype = require('chai-asserttype');
const mongoose = require('../../../../lib/db/mongo/mongoose/index');

const { ObjectId } = require('mongoose').Types;

// SCHEMAS
const Comment = mongoose.model('Comment');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Vendor = mongoose.model('Vendor');
const User = mongoose.model('User');

const { expect } = chai;
chai.use(asserttype);

// TESTS
describe('Schemas', () => {
  // Location data object used across multiple schemas
  const initLocationData = {
    vendorID: new ObjectId(),
    locationDate: Date.now(),
    accuracy: 0,
    address: '123 fake street',
    city: 'springfield',
    neighborhood: 'evergreen terrace',
    tweetID: 't-123',
    startDate: Date.now(),
    endDate: Date.now(),
    matchMethod: 'Tweet location',
    overridden: false,
    coordinates: {
      lat: 90,
      long: 90
    },
    truckNum: 1
  }

  describe('Region schema', () => {
    const initRegionData = {
      name: 'Region1',
      location: 'WASHINGTONDC',
      coordinates: initLocationData,
      timezone: 'EST'
    }

    it('expect to be invalid if name is not provided', (done) => {
      const regionData = {...initRegionData};

      delete regionData['name'];

      const region = new Region(regionData);
      region.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('name');
        done();
      });
    });

    it('expect to be invalid if location is not provided', (done) => {
      const regionData = {...initRegionData};

      delete regionData['location'];

      const region = new Region(regionData);
      region.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('location');
        done();
      });
    });

    it('expect to be invalid if coordinates is not provided', (done) => {
      const regionData = {...initRegionData};

      delete regionData['coordinates'];

      const region = new Region(regionData);
      region.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('coordinates');
        done();
      });
    });

    it('expect to be invalid if timezone is not provided', (done) => {
      const regionData = {...initRegionData};

      delete regionData['timezone'];

      const region = new Region(regionData);
      region.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('timezone');
        done();
      });
    });

    it('expect to be invalid if timezone is not within schema timezone enum', (done) => {
      const regionData = {...initRegionData};

      const pacficTimezone = 'PST';
      regionData.timezone = pacficTimezone;

      const region = new Region(regionData);
      region.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('timezone');
        done();
      });
    });
  });

  describe('Location Schema', () => {
    it('expect to be invalid if vendorID is not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.vendorID;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('vendorID');
        done();
      });
    });

    it('expect location date to exist after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.locationDate;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.locationDate).to.be.date();
        done();
      });
    });

    it('expect accuracy to exist after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.accuracy;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.accuracy).to.be.equal(0);
        done();
      });
    });

    it('expect to be invalid if address is not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.address;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('address');
        done();
      });
    });

    it('expect to be valid if city is not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.city;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to be valid if neighborhood is not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.neighborhood;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to be valid if tweetID is not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.tweetID;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect start date to exist after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.startDate;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.startDate).to.be.date();
        done();
      });
    });

    it('expect end date to exist after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.endDate;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.endDate).to.be.date();
        done();
      });
    });

    it('expect to be invalid if match method is not within schema matchMethod enum', (done) => {
      const locationData = {...initLocationData};

      const invalidValue = 'Test 123';
      locationData.matchMethod = invalidValue;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('matchMethod');
        done();
      });
    });

    it('expect to be valid if match method is within schema matchMethod enum', (done) => {
      const locationData = {...initLocationData};

      const validValue = 'Vendor Input';
      locationData.matchMethod = validValue;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.matchMethod).to.be.equal(validValue);
        done();
      });
    });

    it('expect overridden to exist and be false after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.overridden;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.overridden).to.be.false;
        done();
      });
    });

    it('expect to be invalid if there are more than three values in the coordinates field', (done) => {
      const locationData = {...initLocationData};
      locationData.coordinates = { lat: 3.42424 }

      const location = new Location(locationData);
      location.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('coordinates.long');
        expect(err.errors['coordinates.long'].message).to.equal('Path `coordinates.long` is required.');
        done();
      });
    });

    it('expect to be invalid if the coordinates are out of the lat long ranges', (done) => {
      const locationData = {...initLocationData};
      locationData.coordinates = { lat: 5000, long: 5000 };

      const location = new Location(locationData);
      location.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(2);
        expect(err.errors).to.include.keys('coordinates.long');
        expect(err.errors['coordinates.long'].message).to.equal('Longitude is not in the correct range');
        expect(err.errors).to.include.keys('coordinates.lat');
        expect(err.errors['coordinates.lat'].message).to.equal('Latitude is not in the correct range');
        done();
      });
    });

    it('expect truckNum to exist and be 1 after creation when not provided', (done) => {
      const locationData = {...initLocationData};
      delete locationData.truckNum;

      const location = new Location(locationData);
      location.validate((err) => {
        expect(err).to.be.null;
        expect(location.truckNum).to.be.equal(1);
        done();
      });
    });
  });

  describe('Comment Schema', () => {
    const initCommentSchema = {
      commentDate: Date.now(),
      name: 'Comment1',
      text: 'Test123',
    }

    it('expect to initComment to be valid', (done) => {
      const commentData = {...initCommentSchema};

      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to commentDate to exist and be type date after creation when not provided', (done) => {
      const commentData = {...initCommentSchema};
      delete commentData.commentDate;

      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(err).to.be.null;
        expect(comment.commentDate).to.be.date();
        done();
      });
    });

    it('expect to be invalid if comment name is not provided', (done) => {
      const commentData = {...initCommentSchema};
      delete commentData.name;

      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('name');
        done();
      });
    });

    it('expect to be invalid if text is not provided', (done) => {
      const commentData = {...initCommentSchema};
      delete commentData.text;

      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('text');
        done();
      });
    });

    it('expect to be invalid if the comment length is under 5 characters long', (done) => {
      const commentData = {...initCommentSchema};
      commentData.text = 'test';

      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('text');
        done();
      });
    });

    it('expect to be invalid if the comment length is over 255 characters long', (done) => {
      const commentData = {...initCommentSchema};
      commentData.text = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test t';
      
      const comment = new Comment(commentData);
      comment.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('text');
        done();
      });
    });
  });

  describe('Vendor Schema', () => {
    const initVendorSchema = {
      name: 'schema1',
      type: 'mobileTruck',
      description: 'descrip1',
      establishedDate: Date.now(),
      closedDate: Date.now(),
      creditCard: 'y',
      email: 'test@gmail.com',
      website: 'test.com',
      numTrucks: 1,
      phoneNumber: '7039121234',
      profileImageLink: '123.com',
      bannerImageLink: '123.com',
      price: '$$$',
      yelpId: '123yelp',
      yelpRating: '5start',
      twitterID: '123twitter',
      twitterUserName: '123truck',
      twitterHandle: '123handle',
      tweetHistory: [new ObjectId()],
      locationHistory: [new ObjectId()],
      comments: [],
      consecutiveDaysInactive: 0,
      categories: ['authentic'],
      regionID: new ObjectId(),
      date: Date.now(),
      updateDate: Date.now(),
      approved: false
    }

    it('expect to initVendor to be valid', (done) => {
      const vendorData = {...initVendorSchema};

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to be invalid if type is not within schema type enum', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.type = 'fakeTruck';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('type');
        done();
      });
    });

    it('expect to be invalid if creditCard is not within schema creditCard enum', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.creditCard = 'x';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('creditCard');
        done();
      });
    });

    it('expect to be invalid if type is not within schema type enum', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.type = 'fakeTruck';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('type');
        done();
      });
    });

    it('expect to be valid if phonenumber given (703)-321-1849', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.phoneNumber = '(703)-321-1849';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to be valid if phonenumber given 7033211849', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.phoneNumber = '7033211849';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to be invalid if phonenumber given 000-000-0000', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.phoneNumber = '000-000-0000';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('phoneNumber');
        done();
      });
    });

    it('expect to be invalid if improper phonenumber given FakeNumber', (done) => {
      const vendorData = {...initVendorSchema};
      vendorData.phoneNumber = 'FakeNumber';

      const vendor = new Vendor(vendorData);
      vendor.validate((err) => {
        expect(Object.keys(err.errors).length).to.be.equal(1);
        expect(err.errors).to.include.keys('phoneNumber');
        done();
      });
    });
  });

  describe('User Schema', () => {
    const initUserSchema = {
      email: 'john@gmail.com',
      type: 'admin',
      vendorID: new ObjectId(),
      regionID: new ObjectId(),
      twitterProvider: {
        type: {
          id: 'tst',
          token: 'tst1',
          username: 'tst2',
          displayName: 'tst3'
        }
      },
      select: false
    };

    it('expect to initUserSchema to be valid', (done) => {
      const userData = {...initUserSchema};

      const user = new User(userData);
      user.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to type to be valid if = customer', (done) => {
      const userData = {...initUserSchema};
      userData.type = 'customer';

      const user = new User(userData);
      user.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('expect to type to be valid if = vendor', (done) => {
      const userData = {...initUserSchema};
      userData.type = 'vendor';
      
      const user = new User(userData);
      user.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});
