const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
  slackID: String,
  teamName: String,
  teamID: String,
  units: String,
  accessToken: String,
  bot: {
    bot_user_id: String,
    bot_access_token: String
  },
  requests: {
    type: [
      {
        location: String,
        requested_at: Date
      }
    ],
    default: []
  }
});

module.exports = mongoose.model('Bot', botSchema);
