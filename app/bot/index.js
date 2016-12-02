const getLocation = require('./lib/getLocation');
const weatherFor = require('./lib/weatherFor');
const postInSlack = require('./lib/postInSlack');
const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const postMessage = require('./lib/slackWebClient').postMessage;

function respondWithWeather(web, location, channel) {
  getLocation(location)
    .then((coords) => {
      return weatherFor(coords.lat, coords.lng, coords.location);
    })
    .then((weather) => {
      postInSlack(web, channel, weather);
    })
    .catch(() => {
      postMessage(web, channel, `Could not find weather for ${location}`, { as_user: true })
    });
}

module.exports = function(bot) {
  const token = bot.accessToken;
  const rtm = new RtmClient(token);
  const web = new WebClient(token);

  rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, (message) => {
    if (message === 'invalid_auth' || message == 'account_inactive') {
      console.log(`Removing bot ${bot.slackID} with invalid or inactive token`);
      bot.remove();
    }
  });

  rtm.on(RTM_EVENTS.SUBTEAM_SELF_REMOVED, (message) => {
    console.log(message);
  });

  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    console.log(message);
    if (message.text && message.text.match(RegExp(rtm.activeUserId))) {
      const location = message.text.replace(`<@${rtm.activeUserId}>`, '');
      respondWithWeather(web, location, message.channel);
    }
  });

  rtm.start();
}
