const WeatherReport = require('../../models/WeatherReport');
const getLocation = require('./getLocation');
const getTimeZone = require('./getTimeZone');
const moment = require('moment-timezone');

module.exports = function(token, location, message, units) {
  getLocation(location)
    .then((coords) => {
      return getTimeZone(coords.lat, coords.lng)
    })
    .then((timeZone) => {
      const utcHour = moment.tz("8", "H", "America/New_York").utc().format("H")
      WeatherReport.create({
        token: token,
        channel: message.channel,
        location: location.trim(),
        cron: {
          enabled: true,
          startAt: new Date(),
          interval: `0 0 ${utcHour} * * *`
        }
      });
    });
}
