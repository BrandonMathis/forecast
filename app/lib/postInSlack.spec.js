const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('request');
const postInSlack = require('./postInSlack');
const weatherFor = require('./weatherFor');
const iconFor = require('./iconFor');
const SlackWebClient = require('./slackWebClient');
const nock = require('nock');
const mockWeatherFor = require('../../support/mockWeatherFor');

describe('postInSlack', () => {
  let post;

  beforeEach(() => {
    nock.disableNetConnect();
    mockWeatherFor(process.env.WEATHER_TOKEN);
    post = sinon.stub(request, 'post');
  });

  afterEach(() => {
    post.restore();
  });

  it('will post json to slack api', (done) => {
    weatherFor(0, 0, 'Raleigh, NC, US')
      .then((weather) => {
        const responsURL = 'https://example.com/endpoint';
        const json = postInSlack(responsURL, weather, 'us');
        expect(post.firstCall.args[0].json).to.deep.equal({
          text: '',
          as_user: true,
          response_type: 'in_channel',
          attachments: [
            {
              "color": "#008B8B",
              "fallback": "It's 56° F Clear in Raleigh, NC, US",
              "fields": [
                {
                  "short": true,
                  "title": "High - Low",
                  "value": '62° F - 52° F',
                },
                {
                  "short": true,
                  "title": "Wind",
                  "value": "From the N at 9.67 MPH",
                },
                {
                  "short": true,
                  "title": "Feels Like",
                  "value": '56° F',
                },
                {
                  "short": true,
                  "title": "Precipitation in next hour",
                  "value": "0.5 in",
                }
              ],
              "thumb_url": iconFor('clear-day'),
              "title": `It's 56° F Clear in Raleigh, NC, US`,
              "title_link": "https://darksky.net/37.8267,-122.4233",
            },
            {
              "color": "#008B8B",
              "fallback": "Thursday (H: 62 L: 46)",
              "text": "Partly cloudy overnight. Low 46°.",
              "thumb_url": iconFor('partly-cloudy-night'),
              "title": "Thursday (H: 62 L: 46)",
            },
            {
              "color": "#008B8B",
              "fallback": "Friday (H: 64 L: 48)",
              "text": "Partly cloudy in the morning. Low 48°.",
              "thumb_url": iconFor('partly-cloudy-night'),
              "title": "Friday (H: 64 L: 48)",
            },
            {
              "color": "#008000",
              "fallback": "Saturday (H: 83 L: 55)",
              "footer": "📍 Raleigh, NC, US. http://forecastslackbot.com",
              "text": "Rain throughout the day. High 83°. Chance of rain 76%.",
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
