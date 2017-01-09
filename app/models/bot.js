const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
  slackID: String,
  unit: String,
  accessToken: String
});

module.exports = mongoose.model('Bot', botSchema);
