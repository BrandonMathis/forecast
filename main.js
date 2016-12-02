const app = require('./app');
const activateBot = require('./app/bot');
const mongoose = require('mongoose');
const Bot = require('./app/models/bot');

mongoose.Promise = global.Promise;
mongoose.connect('localhost', 'forecast');

Bot.find({}, (err, bots) => {
  bots.forEach((bot) => {
    activateBot(bot);
  });
});

app.listen(3000, () => {
  console.log("🌤  Forecast is up and running 🌤:");
});

// // Post every day in General
// var CronJob = require('cron').CronJob;
// new CronJob('00 9 0 * * *', function() {
//   respondWithWeather("Durham NC", "#general");
// }, null, true, 'America/New_York');
//
// new CronJob('00 9 0 * * *', function() {
//   respondWithWeather("New Orleans", "#general");
// }, null, true, 'America/Chicago');
