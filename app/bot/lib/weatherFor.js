require('dotenv').config();
const request = require('request');
const moment = require('moment');
const iconFor = require('./iconFor');
const formatTemp = require('./formatTemp');

function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

function weatherFor(lat, lng, location) {
  const token = process.env.WEATHER_TOKEN;

  return new Promise((resolve, reject) => {
    const weatherURL = `https://api.darksky.net/forecast/${token}/${lat},${lng}?exclude=[minutely,hourly]`;
    request(weatherURL, (error, res, body) => {
      if(error) { return reject(error); }
      let json
      try {
        json = JSON.parse(body);
      } catch(e) {
        return reject(`Reponse ${body} was not valid JSON`);
      }
      if(json.currently === undefined) { return reject('Bad response from weather API'); }
      const lat = json.latitude.toString();
      const lng = json.longitude.toString();
      const temp = parseInt(json.currently.temperature);
      const current = {
        temp_f: temp,
        tempString: formatTemp(temp),
        lat: lat,
        lng: lng,
        description: json.currently.summary,
        icon: iconFor(json.currently.icon),
        windString: `From the ${degToCompass(json.currently.windSpeed)} at ${json.currently.windSpeed} MPH`,
        feelsLike: `${parseInt(json.currently.apparentTemperature)}° F`,
        precip1hr: `${json.currently.precipIntensity} in`,
        dewpointString: `${parseInt(json.currently.dewPoint)}° F`,
        darkSkyLink: `https://darksky.net/${lat},${lng}`
      };
      const forecast = json.daily.data.slice(1, 4).map((day) => {
        const high = parseInt(day.temperatureMax);
        const low = parseInt(day.temperatureMin);
        const dow = moment(day.time, 'X').format('dddd');
        return {
          text: day.summary,
          title: `${dow} (H: ${high} L: ${low})`,
          thumb_url: iconFor(day.icon),
          precipProbability: day.precipProbability,
          high: high,
          low: low
        }
      });
      resolve({ location, current, forecast });
    });
  });
}

module.exports = weatherFor;
