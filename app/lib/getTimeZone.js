require('dotenv').config();
const request = require('request');

function getTimeZone(lat, lng) {
  const key = process.env.GOOGLE_MAPS_KEY;
  const url = `https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=${lat},${lng}&timestamp=1&key=${key}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      const json = JSON.parse(body);
      resolve(json.timeZoneId);
    });
  });
}

module.exports = getTimeZone;
