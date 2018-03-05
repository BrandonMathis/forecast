require('dotenv').config();
const WebClient = require('@slack/client').WebClient;
const express = require('express');
const request = require('request');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const { IncomingWebhook } = require('@slack/client');
const Bot = require('./models/bot');
const bodyParser = require('body-parser');
const postInSlack = require('./lib/postInSlack');
const getLocation = require('./lib/getLocation');
const postMessage = require('./lib/slackWebClient').postMessage;
const weatherFor = require('./lib/weatherFor');
const sendHelp = require('./lib/sendHelp');
const SlackWebClient = require('./lib/slackWebClient');
const setUnits = require('./lib/setUnits');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

app.use(clientErrorHandler)
app.use(errorHandler)

const srcPath = __dirname + '/sass';
const destPath = __dirname + '/../public/styles';

if (process.env.NODE_ENV != 'production') {
  app.use('/styles', sassMiddleware({
    src: srcPath,
    dest: destPath,
    debug: true,
    prefix: '/styles',
    outputStyle: 'compressed',
    outputStyle: 'expanded'
  }));
}

app.set('view engine', 'pug');

app.use('/icons', express.static('public/icons'))
app.use('/styles', express.static('public/styles'));
app.use('/robots.txt', express.static('public/robots.txt'));

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/error', (req, res) => {
  res.render('error');
});
app.get('/help', (req, res) => {
  res.render('help');
});

app.post('/weather', (req, res) => {
  const message = req.body;
  const channel = message.channel_id;
  const location = message.text.replace(/<@.*>/, '').replace(/![\w]*/, '');
  const responseURL = message.response_url;

  if (message.text) {
    Bot.find({teamID: message.team_id})
      .then((bots) => {
        const bot = bots[0];
        const web = new WebClient(bot.accessToken);
        const units = bot.units || 'us';
        if (message.text.match(/help\s*$/) || location.match(/^(?![\s\S])/)) {
          res.status(200).send({ text: sendHelp() });
        } else if (message.text.match(/set\s*/)) {
          res.status(200).send({ text: setUnits(bot, message) });
        } else {
          res.status(200).send({ text: `Getting weather for ${location}` });
          getLocation(location)
            .then((coords) => {
              return weatherFor(coords.lat, coords.lng, coords.location, units);
            })
            .then((weather) => {
              const json = postInSlack(web, channel, weather, units);
              var headers = {"Content-type": "application/json"}
              request({
                uri: responseURL,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                json: json
              }, (error, response, body) => {
                if (error) {
                  console.log(error);
                }
              });
            })
            .catch((err) => {
              console.log(err);
              postMessage(web, channel, `Sorry, I could not find any location called ${location}. Can you be more specific?\n\n Just type "/forecast help" if you need help!`, { as_user: true })
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.sendStatus(400);
  }
});

app.get('/auth/slack/callback', (req, res) => {
  const data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code: req.query.code
    }
  };
  request.post('https://slack.com/api/oauth.access', data, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      if( json.bot === undefined ) { return res.redirect('/'); }
      const teamID = json.team_id;
      const slackID = json.bot.bot_user_id;
      const accessToken = json.bot.bot_access_token;
      Bot.findOne({ slackID })
        .then((existingBot) => {
          if ( existingBot ) {
            existingBot.slackID = slackID;
            existingBot.accessToken = accessToken;
            existingBot.teamID = teamID;
            existingBot.save()
              .then(() => {
                return res.redirect('/success');
              });
          } else {
            new Bot({ slackID, teamID, accessToken, bot }).save()
              .then((bot) => {
                res.redirect('/success');
              })
              .catch((_err) => {
                console.log(_err);
                res.redirect('/error');
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/error');
        });
    } else {
      console.log("OAuth error");
      console.log(response.body);
    }
  });
});

module.exports = app;
