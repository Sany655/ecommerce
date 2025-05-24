<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [FrontController::class, 'index'])->name('home');;
Route::get('/cat/{catId}', [FrontController::class, 'show'])->name('home.category_products');
Route::get('/prod/{prodId}', [FrontController::class, 'product_details'])->name('home.product');
Route::post('/cart-products', [FrontController::class, 'cart'])->name('home.cart_products');
Route::get('/cart', fn() => Inertia::render("CartPage"))->name('cart.index');
Route::get('/cart-show', [CartController::class, 'showCart'])->name('cart.show');
Route::post('/cart-add', [CartController::class, 'addToCart'])->name('cart.add');
Route::delete('/cart-remove/{itemId}', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::delete('/cart-delete', [CartController::class, 'clearCart'])->name('cart.delete');
Route::get('/order-invoice/{orderId}', [OrderController::class, 'orderInvoice'])->name('home.order_invoice');
Route::get('/search/{query}', [FrontController::class, 'search'])->name('home.search');
Route::post('/apply-coupon', [FrontController::class, 'applyCoupon'])->name('home.apply_coupon');
Route::get('/get-all-categories', [CategoryController::class, 'getAll'])->name('categories.get_all');
Route::get('/checkout', fn() => Inertia::render("Checkout"))->name('home.checkout');
Route::post('/place-order', [OrderController::class, 'placeOrder'])->name('home.place_order');
Route::post('/online-payment', [OrderController::class, 'onlinePayment'])->name('home.online_payment')->middleware('bkash_auth');
Route::get('/site-contact-info', [FrontController::class, 'contactInfo'])->name('home.contact_info');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('/category', CategoryController::class)->except(['edit', 'create']);
    Route::resource('/product', ProductController::class)->except(['index', 'edit', 'show', 'create']);
    Route::resource('/coupon', CouponController::class)->except(['edit', 'show', 'create']);
    Route::delete('/product/{id}/image', [ProductController::class, 'deleteImage'])->name('product.delete_image');
    Route::resource('/order', OrderController::class)->except(['edit', 'show', 'create', 'update']);

    Route::get('/get-all-coupons', [CouponController::class, 'getAll'])->name('coupon.get_all');
    Route::put('/order-status/{orderId}', [OrderController::class, 'changeOrderStatus'])->name('home.order_status');

    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/thumbnails-settings', [SettingController::class, 'logoAndFaviconUpload'])->name('settings.logo_and_favicon_upload');
    Route::post('/company-settings', [SettingController::class, 'companyInfoUpdate'])->name('settings.company_info_update');
    Route::post('/contact-settings', [SettingController::class, 'contactInfoUpdate'])->name('settings.contact_info_update');
    Route::post('/social-settings', [SettingController::class, 'socialInfoUpdate'])->name('settings.social_info_update');
    Route::post('/payment-settings', [SettingController::class, 'paymentInfoUpdate'])->name('settings.payment_info_update');
    Route::post('/color-settings', [SettingController::class, 'colorInfoUpdate'])->name('settings.color_info_update');
});

Route::get('/clear-cache', function () {
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('storage:link');
    return 'Cache cleared';
});
Route::get('/save-cache', function () {
    Artisan::call('config:cache');
    Artisan::call('route:cache');
    Artisan::call('view:cache');
    return 'cache saved successfully';
});
Route::get('/storage-link', function () {
    Artisan::call('storage:link');
    return 'storage linked';
});

Route::fallback(function () {
    return Inertia::render('NotFound');
});

require __DIR__ . '/auth.php';
