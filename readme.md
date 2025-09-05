# ecommerce app in laravel
visit [barakah](http://shop.mazharulalam.co)

# changes log
* delete order handlers account - done
* note on changing in order status from order handlers - done
* variant in products to chose - done
* order list in a table format - done
* delete order option - done
* order status - so many changes - done
* related products in product details page slide show for mobile - done
* contact floating button at bottom right - done
* track order handlers records - done
* order in bkash
* get discount on bkash payment

<!-- process to install the project -->
1. composer install
2. php artisan migrate
3. php artisan db:seed
4. npm install
5. php artisan key:generate
6. php artisan storage:link
7. npm run dev
8. php artisan serve

In production, upgrading a Laravel app is usually done step-by-step like this:
Put site in maintenance mode → php artisan down --secret="your-secret"
Pull latest code → from git or upload.
Install deps → composer install --no-dev --optimize-autoloader and npm run build (if frontend).
Run migrations safely → php artisan migrate --force.
Clear caches → php artisan config:clear && php artisan cache:clear && php artisan route:clear.
Bring app back → php artisan up.
⚡ Tip: Always backup DB + storage before upgrading.