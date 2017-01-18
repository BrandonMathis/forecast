require('dotenv').config();
const activateBot = require('./bot');
const express = require('express');
const request = require('request');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const Bot = require('./models/bot');
const app = express();

app.use(logger('dev'));

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

app.get('/auth/slack/callback', (req, res) => {
  const data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };
  request.post('https://slack.com/api/oauth.access', data, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      if( json.bot === undefined ) { return res.redirect('/'); }
      const teamId = json.team_id;
      const slackID = json.bot.bot_user_id;
      const accessToken = json.bot.bot_access_token;
      Bot.findOne({ slackID })
        .then((existingBot) => {
          if ( existingBot !== null ) { return res.redirect('/success'); }
          new Bot({ slackID, accessToken }).save()
            .then((bot) => {
              activateBot(bot);
              res.redirect('/success');
            })
            .catch((_err) => {
              console.log(_err);
              res.redirect('/error');
            });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/error');
        });
    }
  });
});

module.exports = app;
