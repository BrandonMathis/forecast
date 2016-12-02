require('dotenv').config();
const weatherSlackJSON = require('./weatherSlackJSON');
const forecastSlackJSON = require('./forecastSlackJSON');
const SlackWebClient = require('./slackWebClient');

function postInSlack(web, channel, weather) {
  const footer = { footer: `📍 ${weather.location}. @ me with any location. http://forecastslackbot.com` };
  const body = {
    as_user: true,
    attachments: [
      weatherSlackJSON(weather),
      forecastSlackJSON(weather.forecast[0]),
      forecastSlackJSON(weather.forecast[1]),
      Object.assign(forecastSlackJSON(weather.forecast[2]), footer)
    ]
  };
  SlackWebClient.postMessage(web, channel, '', body, (err) => {
    if (err) { console.log(err) } // eslint-disable-line
  });
}

module.exports = postInSlack;
