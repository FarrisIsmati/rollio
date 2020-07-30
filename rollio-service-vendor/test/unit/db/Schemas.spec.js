// DEPENDENCIES
const chai = require('chai');
const asserttype = require('chai-asserttype');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../../lib/db/mongo/mongoose/index');

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

//   describe('Comment Schema', () => {
//     it('expect to be invalid if the comment length is under 5 characters long', (done) => {
//       const text = 'four';
//       const comment = new Comment({ text });
//       comment.validate((err) => {
//         expect(err.errors).to.exist;
//         expect(err.errors.text.properties.message).to.equal(`Path \`text\` (\`${text}\`) is shorter than the minimum allowed length (5).`);
//         done();
//       });
//     });

//     it('expect to be invalid if the comment length is over 255 characters long', (done) => {
//       const text = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test t';
//       const comment = new Comment({ text });
//       comment.validate((err) => {
//         expect(err.errors).to.exist;
//         expect(err.errors.text.properties.message).to.equal(`Path \`text\` (\`${text}\`) is longer than the maximum allowed length (255).`);
//         done();
//       });
//     });
//   });

//   describe('Vendor Schema', () => {
//     it('expect to be invalid if type is not within schema timezone enum', (done) => {
//       const fakeVendorType = 'mobileTrucks';
//       const vendor = new Vendor({ type: fakeVendorType });

//       vendor.validate((err) => {
//         expect(err.errors.type).to.exist;
//         expect(err.errors.type.properties.message).to.equal(`\`${fakeVendorType}\` is not a valid enum value for path \`type\`.`);
//         done();
//       });
//     });

//     it('expect to be invalid if creditCard is not within schema creditCard enum', (done) => {
//       const creditCard = 'x';
//       const vendor = new Vendor({ creditCard });
//       vendor.validate((err) => {
//         expect(err.errors.creditCard).to.exist;
//         expect(err.errors.creditCard.properties.message).to.equal(`\`${creditCard}\` is not a valid enum value for path \`creditCard\`.`);
//         done();
//       });
//     });
//   });

//   describe('User Schema', () => {
//     it('expect hasAllRequiredFields to be true if type, email, and regionID included', (done) => {
//       const newUser = new User({ type: 'admin', email: 'fake@fake.com', regionID: ObjectId() });

//       newUser.save((err, user) => {
//         expect(user.hasAllRequiredFields).to.be.true;
//         done();
//       });
//     });

//     it('expect hasAllRequiredFields to be false if regionID is not included', (done) => {
//       const newUser = new User({ type: 'admin', email: 'fake@fake.com' });

//       newUser.save((err, user) => {
//         expect(user.hasAllRequiredFields).to.be.false;
//         done();
//       });
//     });
//   });
});
