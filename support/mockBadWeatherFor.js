const nock = require('nock');

module.exports = function(token) {
  nock(`https://api.darksky.net`)
    .get(`/forecast/${token}/0,0?exclude=[minutely,hourly]`)
    .reply(200, 'Not Found');
};
