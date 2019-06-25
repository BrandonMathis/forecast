const request = require('request');

function getLocation(givenLocation) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=${encodeURIComponent(givenLocation)}&key=${process.env.GOOGLE_MAPS_KEY}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) { console.log(err); } // eslint-disable-line no-console
      const json = JSON.parse(body);
      if (json.results.length === 0) { return reject(`Unable to find location ${givenLocation}`); }
      const lat = json.results[0].geometry.location.lat;
      const lng = json.results[0].geometry.location.lng;
      const location = json.results[0].formatted_address;
      const placeID = json.results[0].placeID;
      resolve({ lat, lng, location, placeID });
    });
  });
}

module.exports = getLocation;
