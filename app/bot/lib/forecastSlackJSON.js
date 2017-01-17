const colorFor = require('./colorFor');

function forecastSlackJson(forecast) {
  const high = forecast.high
  const low = forecast.low
  const color = colorFor((high + low) / 2);
  let chanceOfRain = '';
  if (forecast.precipProbability > 0) {
    const rainProbabilityPercentage = Math.round(forecast.precipProbability * 100);
    chanceOfRain =  ` Chance of rain ${rainProbabilityPercentage}%.`;
  }

  let lowText = '';
  if (low < 50) {
    lowText = ` Low ${low}°.`;
  }

  let highText = '';
  if (high > 80) {
    highText = ` High ${high}°.`;
  }
  return {
    color,
    title: forecast.title,
    fallback: forecast.title,
    text: forecast.text + highText + lowText + chanceOfRain,
    thumb_url: forecast.thumb_url
  };
}

module.exports = forecastSlackJson;
