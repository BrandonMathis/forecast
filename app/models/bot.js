const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const botSchema = new Schema({
  slackID: String,
  teamName: String,
  teamID: String,
  units: String,
  accessToken: String,
  teamName: String,
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

botSchema.plugin(timestamps);
module.exports = mongoose.model('Bot', botSchema);
