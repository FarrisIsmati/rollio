//DEPENDENCIES
const mongoose                = require('../../../controllers/db/schemas/AllSchemas');
const chai                    = require('chai');
const expect                  = chai.expect;

//SEED FILE
const productionSeedFile      = require('../../../controllers/db/seeds/productionSeedJSON');

//Test the seed JSON file to make sure all required fields exist and no non specified fields exist
