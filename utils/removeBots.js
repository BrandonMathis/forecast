const mongoose = require('mongoose');
const Bot = require('../app/models/bot');

mongoose.Promise = global.Promise;
mongoose.connect('localhost', 'forecast');

console.log("Removing Bots");
Bot.find({})
  .then((bots) => {
    bots.forEach((bot) => {
      console.log(bot);
      bot.remove();
    });
  });

mongoose.disconnect();
