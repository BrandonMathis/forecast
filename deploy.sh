ssh root@forecastslackbot.com bash -c "'
cd /var/www/forecast
git pull origin master --force
yarn install
pm2 restart process.json --env production
'"
