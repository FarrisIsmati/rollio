const PhoneNumber = require( 'awesome-phonenumber' );

const phoneNumberValidate = (number) => {
  //Region Code currently only US
  const pn = new PhoneNumber( number, 1 );
  return pn.isValid();
}

module.exports = {
  phoneNumberValidate
};
