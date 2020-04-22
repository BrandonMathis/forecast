const expect = require('chai').expect;
const getLocation = require('./getLocation');
const nock = require('nock');

describe('getLocation', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    const body = require('../../support/maps.json');
    nock('https://maps.googleapis.com:443')
      .get(`/maps/api/geocode/json?sensor=false&address=Raleigh%20NC&key=${process.env.GOOGLE_MAPS_KEY}`)
      .reply(200, body);
  });

  it('resolves a promise with lat and lng', (done) => {
    getLocation('Raleigh NC')
      .then((coords) => {
        expect(coords.lat).to.eq(35.7795897);
        expect(coords.lng).to.eq(-78.6381787);
        done();
      })
      .catch(done);
  });
});
