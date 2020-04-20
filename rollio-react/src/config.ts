const {
  REACT_APP_VENDOR_API,
  REACT_APP_MAPBOX_API_KEY,
  REACT_APP_GOOGLE_PLACES_API_KEY
} = process.env;

const VENDOR_API = REACT_APP_VENDOR_API;
const MAPBOX_API_KEY= REACT_APP_MAPBOX_API_KEY;
const GOOGLE_PLACES_API_KEY = REACT_APP_GOOGLE_PLACES_API_KEY;

console.log('Vendor API');
console.log(VENDOR_API);

export {
    VENDOR_API,
    MAPBOX_API_KEY,
    GOOGLE_PLACES_API_KEY
}