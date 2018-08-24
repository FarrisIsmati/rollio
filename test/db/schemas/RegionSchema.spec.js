//DEPENDENCIES
const mongoose    = require('../../../controllers/db/schemas/AllSchemas');
const chai        = require('chai');
const expect      = chai.expect;

//SCHEMAS
const Region      = mongoose.model('Region');

//TESTS
describe('Region schema', function() {
    it('should be invalid if timezone is not within schema timezone enum', done => {
        const fakeTimezone = 'FAKETEST'
        const region = new Region({ timezone: fakeTimezone});

        region.validate(err => {
            expect(err.errors.timezone).to.exist;
            expect(err.errors.timezone.properties.message).to.equal(`\`${fakeTimezone}\` is not a valid enum value for path \`timezone\`.`)
            done();
        });
    });
});

//HELPING RESOURCE
  //https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/
