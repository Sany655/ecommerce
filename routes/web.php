<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
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
Route::get('/prod/{prodId}', [FrontController::class, 'show_product'])->name('home.product');
Route::get('/related-products/{catId}', [FrontController::class, 'related_products'])->name('home.related_products');
Route::post('/cart-products', [FrontController::class, 'cart'])->name('home.cart_products');

Route::get('/cart', fn() => Inertia::render("CartPage"))->name('cart.index');
Route::get('/cart-show', [CartController::class, 'showCart'])->name('cart.show');
Route::post('/cart-add', [CartController::class, 'addToCart'])->name('cart.add');
Route::delete('/cart-remove/{itemId}', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::delete('/cart-delete', [CartController::class, 'clearCart'])->name('cart.delete');
Route::get('/checkout', fn() => Inertia::render("Checkout"))->name('home.checkout');
Route::post('/place-order', [OrderController::class, 'placeOrder'])->name('home.place_order');
Route::get('/order-invoice/{orderId}', [OrderController::class, 'orderInvoice'])->name('home.order_invoice');
Route::get('/download-invoice/{orderId}', [OrderController::class, 'downloadInvoice'])->name('home.download_invoice');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('/category', CategoryController::class);
    Route::resource('/product', ProductController::class);
    Route::resource('/order', OrderController::class);

    Route::put('/order-status/{orderId}', [OrderController::class, 'changeOrderStatus'])->name('home.order_status');
});

Route::fallback(function () {
    return Inertia::render('NotFound');
});

require __DIR__ . '/auth.php';
