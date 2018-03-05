const app = require('./app');
const mongoose = require('mongoose');
const Bot = require('./app/models/bot');
const WeatherReport = require('./app/models/WeatherReport');

mongoose.Promise = global.Promise;
mongoose.connect('localhost', 'forecast');

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

app.listen(3000, () => {
  console.log("🌤  Forecast is up and running 🌤:");
});
