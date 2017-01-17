ssh root@forecastslackbot.com bash -c "'
cd /var/www/forecast
git pull origin master --force
npm install
pm2 restart process.json --env production
'"
