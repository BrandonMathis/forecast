const nock = require('nock');

module.exports = function() {
  nock('http://maps.googleapis.com:80')
  .get('/maps/api/geocode/json?sensor=false&address=Raleigh%20NC')
  .reply(200, require('./maps.json'));
}
