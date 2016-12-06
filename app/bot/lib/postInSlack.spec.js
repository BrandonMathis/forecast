const expect = require('chai').expect;
const sinon = require('sinon');
const postInSlack = require('./postInSlack');
const weatherFor = require('./weatherFor');
const formatTemp = require('./formatTemp');
const iconFor = require('./iconFor');
const SlackWebClient = require('./slackWebClient');
const nock = require('nock');
const mockWeatherFor = require('../../../support/mockWeatherFor');

describe('postInSlack', () => {
  let postMessage;

  beforeEach(() => {
    nock.disableNetConnect();
    mockWeatherFor(process.env.WEATHER_TOKEN);
    postMessage = sinon.stub(SlackWebClient, 'postMessage');
  });

  afterEach(() => {
    postMessage.restore();
  });

  it('will post json to slack api', (done) => {
    weatherFor(0, 0, 'Raleigh, NC, US')
      .then((weather) => {
        postInSlack({}, '#channel', weather);
        expect(postMessage.calledOnce).to.be.true;
        expect(postMessage.firstCall.args[0]).to.deep.eq({});
        expect(postMessage.firstCall.args[1]).to.eq('#channel');
        expect(postMessage.firstCall.args[2]).to.eq('');
        expect(postMessage.firstCall.args[3]).to.deep.equal({
          as_user: true,
          attachments: [
            {
              "color": "#008B8B",
              "fields": [
                {
                  "short": true,
                  "title": "Wind",
                  "value": "From the N at 9.67 MPH",
                },
                {
                  "short": true,
                  "title": "Feels Like",
                  "value": formatTemp('56'),
                },
                {
                  "short": true,
                  "title": "Precipitation in next hour",
                  "value": "0.5 in",
                },
                {
                  "short": true,
                  "title": "Dewpoint",
                  "value": formatTemp('45'),
                }
              ],
              "thumb_url": iconFor('clear-day'),
              "title": `It's ${formatTemp('56')} Clear in Raleigh, NC, US`,
              "title_link": "https://darksky.net/37.8267,-122.4233",
            },
            {
              "color": "#008B8B",
              "text": "Partly cloudy overnight. Low 46° F.",
              "thumb_url": iconFor('partly-cloudy-night'),
              "title": "Thursday (H: 62 L: 46)",
            },
            {
              "color": "#008B8B",
              "text": "Partly cloudy in the morning. Low 48° F.",
              "thumb_url": iconFor('partly-cloudy-night'),
              "title": "Friday (H: 64 L: 48)",
            },
            {
              "color": "#008000",
              "footer": "📍 Raleigh, NC, US. @ me with any location. http://forecastslackbot.com",
              "text": "Rain throughout the day. High 83° F. Chance of rain 76%.",
              "thumb_url": iconFor('rain'),
              "title": "Saturday (H: 83 L: 55)",
            },
          ],
        });
        done();
    })
    .catch(done)
  });
});