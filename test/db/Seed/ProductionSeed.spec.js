//SPECIFICALLY TESTS THE PRODUTION SEED FILE TO MAKE SURE ALL REQ FIELDS EXIST & NO NON SPECIFIED FIELDS EXIST

//DEPENDENCIES
const mongoose                = require('../../../controllers/db/schemas/AllSchemas');
const chai                    = require('chai');
const expect                  = chai.expect;

//SEED FILE
const productionSeedFile      = require('../../../controllers/db/seeds/productionSeedJSON');
