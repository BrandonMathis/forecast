const colorFor = require('./colorFor');

function weatherSlackJSON(weather) {
  return {
    title: `It's ${weather.current.tempString} ${weather.current.description} in ${weather.location}`,
    color: colorFor(weather.current.temp_f),
    title_link: weather.current.darkSkyLink,
    thumb_url: weather.current.icon,
    fields: [
      {
        title: 'Wind',
        value: weather.current.windString,
        short: true
      },
      {
        title: 'Feels Like',
        value: weather.current.feelsLike,
        short: true
      },
      {
        title: 'Precipitation in next hour',
        value: weather.current.precip1hr,
        short: true
      },
      {
        title: 'Dewpoint',
        value: weather.current.dewpointString,
        short: true
      }
    ]
  };
}

module.exports = weatherSlackJSON;
