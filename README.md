### requirements
1. category wise input options for products (customizable attributes) done
2. multiple image with zoom effect for product (alwanilifestyle.com) done
3. card design (alwanilifestyle.com) done
4. banner (between image and logo+ name vertical) done

### deployment tutorial: https://www.youtube.com/watch?v=2TpFkWHDOUI&list=LL&index=10

# deployment instructions
Since your shared hosting does not provide terminal access, you will need to adjust your deployment strategy. Shared hosting environments typically rely on FTP/SFTP for file uploads and cPanel for managing certain configurations. Below are the steps adapted for shared hosting environments without terminal access:

### 1. **Prepare Your Application Locally**
You will need to prepare your Laravel app on your local machine or development environment.

- **Install Composer Dependencies (locally)**:
  
  On your local machine, run:

  ```bash
  composer install --optimize-autoloader --no-dev
  ```

  This will prepare the vendor folder, which contains all the necessary dependencies.

- **Build Frontend Assets (if using Laravel Mix)**:
  
  If you're using Laravel Mix for asset management, compile the assets for production:

  ```bash
  npm install
  npm run production
  ```

  This will generate your minified CSS/JS files in the `public` folder.

### 2. **Upload Your Application to Shared Hosting**
Once your application is prepared locally, follow these steps:

- **Access cPanel**: Log in to your shared hosting provider’s cPanel.
  
- **Upload Files**:
  - Using **FTP/SFTP** or cPanel’s File Manager, upload your Laravel project files.
  - **Important**: Make sure the `public` folder contents go into the `public_html` folder (or equivalent) on your shared hosting. 
    - Upload the rest of the files (excluding `public`) into a separate directory outside of `public_html` for security (e.g., create a `laravel-app` folder).

- **File Structure on Shared Hosting**:
  - `public_html/` should contain the contents of Laravel's `public/` folder.
  - A new folder (e.g., `laravel-app/`) should contain the remaining Laravel files (app, routes, resources, etc.).

### 3. **Update Index.php for Correct Paths**
You need to tell Laravel where the app files are relative to the `public_html` folder:

- Go to `public_html/index.php`.
- Update the paths to the autoloader and bootstrap file:

  ```php
  require __DIR__.'/../laravel-app/vendor/autoload.php';
  $app = require_once __DIR__.'/../laravel-app/bootstrap/app.php';
  ```

### 4. **Set Up Database**
- **Create a Database**: In cPanel, go to the **MySQL Databases** section and create a new database, a database user, and assign that user to the database.
  
- **Update `.env` File**: 
  - Edit your `.env` file to include the correct database credentials:
  
    ```env
    DB_CONNECTION=mysql
    DB_HOST=your_database_host
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

### 5. **Configure `.env` for Production**
Ensure your `.env` file is set for production:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=your_app_key
```

Make sure the correct **mail configuration** and any other environment-specific variables are set.

### 6. **Run Migrations and Seed Database (Without Terminal)**
Since you don’t have terminal access to run commands like `php artisan migrate`, you will need a workaround:

- **Create a Custom Route**:
  
  In `routes/web.php`, add the following temporary route to run migrations:

  ```php
  Route::get('/run-migrations', function () {
      Artisan::call('migrate', ['--force' => true]);
      return 'Migrations are run successfully';
  });
  ```

  Then, visit `yourwebsite.com/run-migrations` to execute the migrations.

  **Important**: After running the migrations, **remove this route** for security reasons.

### 7. **Set File Permissions Using cPanel**
- **File Manager in cPanel**: Use the File Manager to ensure that the following directories are writable by the web server:
  - `storage/`
  - `bootstrap/cache/`
  
  Set the permissions to **775** or **777** depending on your hosting provider's requirements.

### 8. **Set Up Email on cPanel**
If you're using the server's email settings (e.g., SMTP settings for `shop@hamdaanz.com`), ensure your `.env` file is correctly configured:

```env
MAIL_MAILER=smtp
MAIL_HOST=host.com
MAIL_PORT=465
MAIL_USERNAME=email@domain.com
MAIL_PASSWORD=your_mail_password
MAIL_ENCRYPTION=ssl
```

You can test email functionality using a form on your site to check if emails are being sent properly.

### 9. **Optimize Application Locally**
Since you cannot run terminal commands on shared hosting, optimize the application locally before uploading.

- **Optimize Config**:

  ```bash
  php artisan config:cache
  ```

- **Optimize Routes**:

  ```bash
  php artisan route:cache
  ```

- **Optimize Views**:

  ```bash
  php artisan view:cache
  ```

These commands will cache the configuration, routes, and views for better performance.

### 10. **Set Up Cron Jobs via cPanel**
If your application uses scheduled tasks (cron jobs), you can configure them in cPanel:

- Go to **Cron Jobs** in cPanel.
- Set up a cron job to run Laravel's scheduler every minute:

  * cd /home/ayurvedabd/test.hamdaanz.com && php artisan schedule:run >> /dev/null 2>&1

  ```bash
  * * * * * php /home/yourusername/laravel-app/artisan schedule:run >> /dev/null 2>&1
  ```
Make sure to update the path to your Laravel app's `artisan` file.

### 11. **Enable SSL (Optional)**
To secure your site with HTTPS, use SSL certificates:

- In cPanel, navigate to **SSL/TLS** and install an SSL certificate (e.g., from Let's Encrypt).
  
- Ensure your web traffic is redirected to HTTPS in your `.htaccess` file within the `public_html` directory:

  ```bash
  <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteCond %{HTTPS} off
      RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  </IfModule>
  ```

### 12. **Test Your Application**
- Test the site by visiting the URL.
- Check if the database, file uploads, and email sending are working properly.
- Monitor your logs using **cPanel's File Manager** to view `storage/logs/laravel.log` for any errors.

---

By following these steps, you can successfully deploy your Laravel application on a shared hosting environment.
product with variation database
https://www.youtube.com/watch?v=8bkGKwb29L4
