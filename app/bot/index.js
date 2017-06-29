const _ = require('lodash');
const getLocation = require('./lib/getLocation');
const getTimeZone = require('./lib/getTimeZone');
const weatherFor = require('./lib/weatherFor');
const postInSlack = require('./lib/postInSlack');
const scheduleWeatherReport = require('./lib/scheduleWeatherReport');
const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const postMessage = require('./lib/slackWebClient').postMessage;

function respondWithWeather(bot, web, location, message) {
  const channel = message.channel;
  let units;
  if (message.text.match(/!([\w]*)/)) {
    units = message.text.match(/!([\w]*)/)[1];
  } else {
    units = bot.units || 'us';
  }
  getLocation(location)
    .then((coords) => {
      return weatherFor(coords.lat, coords.lng, coords.location, units);
    })
    .then((weather) => {
      postInSlack(web, channel, weather, units);
    })
    .catch(() => {
      postMessage(web, channel, `Sorry, I could not find any location called ${location}. Can you be more specific?\n\n Just type "@forecast help" if you need help!`, { as_user: true })
    });
}

function helpMessage(bot, rtm, message) {
  const exampleLocation = _.sample([
    'Paris, France',
    'Tokyo',
    'Durham',
    'Antarctica',
    '90210'
  ]);
  rtm.sendMessage(`
*Get Weather*  
> \`@forecast ${exampleLocation}\` to get weather for location (try any place in the world)  
> \`@forecast ${exampleLocation} !us\` to get weather for location in specific units (us or si)  
*Settings*  
> \`@forecast set (si/us)\` to change units (\`si\` for metric, \`us\` for imperial)  
`, message.channel);
}

function setUnits(bot, rtm, message) {
  let units = message.text.match(/set\s*([\w]*)$/)[1];
  units = units.toLowerCase();
  if(_.includes(['si', 'us'], units)) {
    bot.units = units;
    console.log(`Setting bot units to ${units}`);
    bot.save();
    rtm.sendMessage(`Your preferred units have been set to *${units}*`, message.channel);
  }
}

module.exports = function(bot) {
  const token = bot.accessToken;
  const rtm = new RtmClient(token, { autoReconnect: false });
  const web = new WebClient(token);

  rtm.on(CLIENT_EVENTS.UNABLE_TO_RTM_START, (message) => {
    if (message === 'invalid_auth' || message == 'account_inactive') {
      console.log(`Removing bot ${bot.slackID} with invalid or inactive token`);
      bot.remove();
    }
  });

  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    if(!message.text) { return }
    const location = message.text.replace(/<@.*>/, '').replace(/![\w]*/, '');
    if (message.user != rtm.activeUserId && message.text && message.text.match(RegExp(rtm.activeUserId))) {
      //
      // @forecast help
      //
      if (message.text.match(/help\s*$/) || location.match(/^(?![\s\S])/)) {
        helpMessage(bot, rtm, message);
      //
      // @forecast set <unit>
      //
      } else if (message.text.match(/set\s*/)) {
        setUnits(bot, rtm, message);
      //
      // @forecast schedule <location>
      //
      // } else if(message.text.match(/schedule\s|)}>#)) {
      //   scheduleWeatherReport(token, location.replace('schedule', ''), message, bot.units);
      //
      // @forecast <Location>
      //
      } else {
        console.log(`🤖  Weather Requested for ${location}`);
        respondWithWeather(bot, web, location, message);
      }
    }
  });

  rtm.start();
}
