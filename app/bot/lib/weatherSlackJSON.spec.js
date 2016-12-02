const expect = require('chai').expect;
const nock = require('nock');
const weatherFor = require('./weatherFor');
const mockWeatherFor = require('../../../support/mockWeatherFor');
const weatherSlackJSON = require('./weatherSlackJSON');
const colorFor = require('./colorFor');

describe('weatherSlackJSON', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    mockWeatherFor(process.env.WEATHER_TOKEN);
  });

  it('will return json formatted for a slack message', (done) => {
    weatherFor(0, 0, 'Raleigh, NC, US')
      .then((weather) => {
        const json = weatherSlackJSON(weather);
        expect(json.title).to.eq(`It's ${weather.current.tempString} ${weather.current.description} in ${weather.location}`);
        expect(json.color).to.eq(colorFor(weather.current.temp_f));
        expect(json.title_link).to.eq(weather.current.darkSkyLink);
        expect(json.thumb_url).to.eq(weather.current.icon);
        expect(json.fields[0].title).to.eq('Wind');
        expect(json.fields[0].value).to.eq(weather.current.windString);
        expect(json.fields[0].short).to.eq(true);
        expect(json.fields[1].title).to.eq('Feels Like');
        expect(json.fields[1].value).to.eq(weather.current.feelsLike);
        expect(json.fields[1].short).to.eq(true);
        expect(json.fields[2].title).to.eq('Precipitation in next hour');
        expect(json.fields[2].value).to.eq(weather.current.precip1hr);
        expect(json.fields[2].short).to.eq(true);
        expect(json.fields[3].title).to.eq('Dewpoint');
        expect(json.fields[3].value).to.eq(weather.current.dewpointString);
        expect(json.fields[3].short).to.eq(true);
        done();
      })
      .catch(done);
  });
});
