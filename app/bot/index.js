const _ = require('lodash');
const getLocation = require('./lib/getLocation');
const weatherFor = require('./lib/weatherFor');
const postInSlack = require('./lib/postInSlack');
const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const postMessage = require('./lib/slackWebClient').postMessage;

function respondWithWeather(web, location, channel, units) {
  getLocation(location)
    .then((coords) => {
      return weatherFor(coords.lat, coords.lng, coords.location, units);
    })
    .then((weather) => {
      postInSlack(web, channel, weather);
    })
    .catch(() => {
      postMessage(web, channel, `Sorry, I could not find any location called ${location}. Can you be more specific?\n\n Just type "@forecast help" if you need help!`, { as_user: true })
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

  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    const location = message.text.replace(`<@${rtm.activeUserId}>`, '').replace(/![\w]*/, '');
    if (message.user != rtm.activeUserId && message.text && message.text.match(RegExp(rtm.activeUserId))) {
      if (message.text.match(/help\s*$/) || location.match(/^(?![\s\S])/)) {
        const exampleLocation = _.sample([
          'Paris, France',
          'Tokyo',
          'Durham',
          'Antarctica',
          '90210'
        ]);
        rtm.sendMessage(`Just @ me with any location in the world! (ie: @forecast ${exampleLocation})`, message.channel);
      } else {
        console.log(`🤖  Weather Requested for ${location}`);
        let units = 'us';
        if (message.text.match(/!([\w]*)/)) {
          units = message.text.match(/!([\w]*)/)[1].toLowerCase();
        }
        respondWithWeather(web, location, message.channel, units);
      }
    }
  });

  rtm.start();
}
