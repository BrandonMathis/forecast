const nock = require('nock');

module.exports = function(token) {
  nock(`https://api.darksky.net`)
    .get(`/forecast/${token}/0,0?exclude=[minutely,hourly]&units=us`)
    .reply(200, require('./darksky.json'));
}
