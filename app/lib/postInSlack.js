require('dotenv').config();
const weatherSlackJSON = require('./weatherSlackJSON');
const forecastSlackJSON = require('./forecastSlackJSON');
const SlackWebClient = require('./slackWebClient');

module.exports = function (web, channel, weather, units) {
  const footer = { footer: `📍 ${weather.location}. http://forecastslackbot.com` };
  return {
    text: '',
    as_user: true,
    response_type: 'in_channel',
    attachments: [
      weatherSlackJSON(weather, units),
      forecastSlackJSON(weather.forecast[0], units),
      forecastSlackJSON(weather.forecast[1], units),
      Object.assign(forecastSlackJSON(weather.forecast[2], units), footer)
    ]
  };
}
