https://www.youtube.com/watch?v=SMa2na3FKsM
to implement bkash in laravel
https://www.youtube.com/watch?v=_doFKWa-OvM

# production preparation
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
composer dump-autoload --optimize