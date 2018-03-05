const _ = require('lodash');
const SlackWebClient = require('./slackWebClient');

module.exports = function (bot, message) {
  const setUnitMessage = message.text.match(/set\s*([\w]*)$/);
  if (!setUnitMessage) { return }
  let units = setUnitMessage[1];
  units = units.toLowerCase();
  if(_.includes(['si', 'us'], units)) {
    bot.units = units;
    bot.save();
    return `Your preferred units have been set to *${units}*`;
  } else {
    return `${units} is not a valid unit. (Forecast only support *si* and *us*`;
  }
}
