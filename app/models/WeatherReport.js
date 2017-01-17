const mongoose = require('mongoose');
const { cronPlugin } = require('mongoose-cron');
const Schema = mongoose.Schema;
const getLocation = require('../bot/lib/getLocation');
const postMessage = require('../bot/lib/slackWebClient').postMessage;
const postInSlack = require('../bot/lib/postInSlack');
const weatherFor = require('../bot/lib/weatherFor');
const WebClient = require('@slack/client').WebClient;

const weatherReportSchema = new Schema({
  location: String,
  token: String,
  channel: String,
  units: String,
  bot: { type: Number, ref: 'Bot' }
});

weatherReportSchema.plugin(cronPlugin, {
  handler: function(jobInfo) {
    const location = jobInfo.location;
    const channel = jobInfo.channel;
    const token = jobInfo.token;
    const units = jobInfo.units;
    const web = new WebClient(token);
    getLocation(location)
      .then((coords) => {
        return weatherFor(coords.lat, coords.lng, coords.location, units);
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
