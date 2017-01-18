require('dotenv').config();
const weatherSlackJSON = require('./weatherSlackJSON');
const forecastSlackJSON = require('./forecastSlackJSON');
const SlackWebClient = require('./slackWebClient');

function postInSlack(web, channel, weather, units) {
  const footer = { footer: `📍 ${weather.location}. @ me with any location. http://forecastslackbot.com` };
  const body = {
    as_user: true,
    attachments: [
      weatherSlackJSON(weather, units),
      forecastSlackJSON(weather.forecast[0], units),
      forecastSlackJSON(weather.forecast[1], units),
      Object.assign(forecastSlackJSON(weather.forecast[2], units), footer)
    ]
  };
  SlackWebClient.postMessage(web, channel, '', body, (err) => {
    if (err) { console.log(err) } // eslint-disable-line
  });
}

module.exports = postInSlack;
