const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
  slackID: String,
  teamName: String,
  units: String,
  accessToken: String,
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
