const mongoose = require('mongoose');
const { cronPlugin } = require('mongoose-cron');
const Schema = mongoose.Schema;
const getLocation = require('../bot/lib/getLocation');
const postMessage = require('../bot/lib/slackWebClient').postMessage;
const postInSlack = require('../bot/lib/postInSlack');
const weatherFor = require('../bot/lib/weatherFor');
const WebClient = require('@slack/client').WebClient;
const Bot = require('./bot.js');

const weatherReportSchema = new Schema({
  location: String,
  token: String,
  channel: String,
});

weatherReportSchema.plugin(cronPlugin, {
  handler: function(jobInfo) {
    const location = jobInfo.location;
    const channel = jobInfo.channel;
    const token = jobInfo.token;
    const web = new WebClient(token);
    Promise.all([
      Bot.find({accessToken: token}),
      getLocation(location)
    ])
      .then((values) => {
        const bot = values[0][0];
        const coords = values[1];
        return weatherFor(coords.lat, coords.lng, coords.location, bot.units);
      })
      .then((weather) => {
        console.log(`Reporting Weather For ${jobInfo.location}`);
        postInSlack(web, channel, weather);
      })
      .catch(() => {
        console.log(`Failed to report weather for ${location}. Performed by bot ${bot.id}.`);
      });
  }
});

module.exports = mongoose.model('WeatherReport', weatherReportSchema);
