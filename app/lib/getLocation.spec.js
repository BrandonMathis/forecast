const expect = require('chai').expect;
const getLocation = require('./getLocation');
const nock = require('nock');
const mockGoogleMaps = require('../../support/mockGoogleMaps');

describe('getLocation', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    mockGoogleMaps();
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
