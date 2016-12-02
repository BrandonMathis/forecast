function postMessage(web, channel, text, body, callback) {
  web.chat.postMessage(channel, text, body, callback);
}

module.exports = {
  postMessage
}
