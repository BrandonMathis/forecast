const request = require('request');

function getLocation(location) {
  const givenLocation = location;
  this.url = `http://maps.googleapis.com/maps/api/geocode/json?sensor=false&key=${process.env.GOOGLE_MAPS_KEY}&address=${encodeURIComponent(location)}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      const json = JSON.parse(body);
      if (json.results.length === 0 ) { return reject(`Unable to find location ${givenLocation}`) };
      const lat = json.results[0].geometry.location.lat;
      const lng = json.results[0].geometry.location.lng;
      const location = json.results[0].formatted_address;
      resolve({lat, lng, location});
    });
  });
}

module.exports = getLocation;
