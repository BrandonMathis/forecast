const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
  slackID: String,
  accessToken: String
});

module.exports = mongoose.model('Bot', botSchema);
