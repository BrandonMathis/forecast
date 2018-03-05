require('dotenv').config();
const request = require('request');
const weatherSlackJSON = require('./weatherSlackJSON');
const forecastSlackJSON = require('./forecastSlackJSON');
const SlackWebClient = require('./slackWebClient');

module.exports = function (responseURL, weather, units) {
  const footer = { footer: `📍 ${weather.location}. http://forecastslackbot.com` };
  request.post({
    uri: responseURL,
    headers: {
        'Content-type': 'application/json'
    },
    json: {
      text: '',
      as_user: true,
      response_type: 'in_channel',
      attachments: [
        weatherSlackJSON(weather, units),
        forecastSlackJSON(weather.forecast[0], units),
        forecastSlackJSON(weather.forecast[1], units),
        Object.assign(forecastSlackJSON(weather.forecast[2], units), footer)
      ]
    }
  }, (error, response, body) => {
    if (error) {
      console.log(error);
    }
  });
}
