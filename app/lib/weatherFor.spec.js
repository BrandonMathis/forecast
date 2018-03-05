require('dotenv').config();
const expect = require('chai').expect
const weatherFor = require('./weatherFor');
const nock = require('nock');
const mockWeatherFor = require('../../support/mockWeatherFor');
const mockBadWeatherFor = require('../../support/mockBadWeatherFor');
const iconFor = require('./iconFor');

describe('weatherFor', () => {
  context('with good response', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      mockWeatherFor(process.env.WEATHER_TOKEN);
    });

    it('responds with current weather conditions for location', (done) => {
      weatherFor(0, 0, "Raleigh, NC, USA")
        .then((weather) => {
          expect(weather.location).to.eq('Raleigh, NC, USA');
          expect(weather.current.temp_f).to.eq(56);
          expect(weather.current.tempString).to.eq('56° F');
          expect(weather.current.description).to.eq('Clear');
          expect(weather.current.lat).to.eq('37.8267');
          expect(weather.current.lng).to.eq('-122.4233');
          expect(weather.current.icon).to.eq(iconFor('clear-day'));
          expect(weather.current.windString).to.eq('From the N at 9.67 MPH');
          expect(weather.current.feelsLike).to.eq('56° F');
          expect(weather.current.precip1hr).to.eq('0.5 in');
          expect(weather.current.dewpointString).to.eq('45° F');
          expect(weather.current.darkSkyLink).to.eq(`https://darksky.net/${weather.current.lat},${weather.current.lng}`);
          expect(weather.forecast[0].high).to.eq(62);
          expect(weather.forecast[0].low).to.eq(46);
          expect(weather.forecast[0].title).to.eq(`Thursday (H: 62 L: 46)`);
          expect(weather.forecast[0].text).to.eq('Partly cloudy overnight.');
          expect(weather.forecast[0].thumb_url).to.eq(iconFor('partly-cloudy-night'));
          expect(weather.forecast[0].precipProbability).to.eq(0);
          expect(weather.forecast[1].high).to.eq(64);
          expect(weather.forecast[1].low).to.eq(48);
          expect(weather.forecast[1].title).to.eq(`Friday (H: 64 L: 48)`);
          expect(weather.forecast[1].text).to.eq('Partly cloudy in the morning.');
          expect(weather.forecast[1].thumb_url).to.eq(iconFor('partly-cloudy-night'));
          expect(weather.forecast[1].precipProbability).to.eq(0);
          expect(weather.forecast[2].high).to.eq(83);
          expect(weather.forecast[2].low).to.eq(55);
          expect(weather.forecast[2].title).to.eq(`Saturday (H: 83 L: 55)`);
          expect(weather.forecast[2].text).to.eq('Rain throughout the day.');
          expect(weather.forecast[2].thumb_url).to.eq(iconFor('rain'));
          expect(weather.forecast[2].precipProbability).to.eq(0.76000002);
          done();
        })
        .catch(done);
    });
  });

  context('with bad response', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      mockBadWeatherFor(process.env.WEATHER_TOKEN);
    });

    it('will resolve in an error', (done) => {
      weatherFor(0, 0)
        .then((weather) => {
          expect(false).to.be.true;
          done();
        })
        .catch((err) => {
          expect(err).to.eq('Reponse Not Found was not valid JSON');
          done();
        })
        .catch(done);
    });
  });
});
