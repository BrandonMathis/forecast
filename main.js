const app = require('./app');
const activateBot = require('./app/bot');
const mongoose = require('mongoose');
const Bot = require('./app/models/bot');
const WeatherReport = require('./app/models/WeatherReport');

mongoose.Promise = global.Promise;
mongoose.connect('localhost', 'forecast');

Bot.find({}, (err, bots) => {
  for (var start = 0; start < bots.length; start++) {
    const bot = bots[start];
    setTimeout(function() {
      console.log(`Starting bot ${bot.slackID}`)
      try {
        activateBot(bot);
      } catch(err) {
        console.log(err);
      }
    }, 1500 * (start + 1));
  }
});

WeatherReport.createCron().start();

process.on('uncaughtException', (err) => {
  fs.writeSync(1, `Caught exception: ${err}`);
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
