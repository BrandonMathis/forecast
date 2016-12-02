ssh root@forecastslackbot.com bash -c "'
cd /var/www/forecast
git pull origin master
pm2 restart process.json --env production
'"
