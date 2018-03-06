module.exports = function(description) {
  description = description.replace('-night', '');
  description = description.replace('-day', '');
  description = {
    'clear': 'clear',
    'rain': 'rain',
    'snow': 'snow',
    'sleet': 'sleet',
    'wind': 'hazy',
    'fog': 'fog',
    'cloudy': 'partlysunny',
    'partly-cloudy': 'partlycloudy',
    'thunderstorm': 'tstorms',
    'tornado': 'tstorms',
    'hail': 'sleet'
  }[description] || 'unknown'
  return `http://forecastslackbot.com/icons/black/png/256x256/${description}.png`
}
