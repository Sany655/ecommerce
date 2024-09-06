<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory()->count(10)->create();
        User::factory()->create();

        // Category::factory()->count(5)->create(); // Creates 5 top-level categories
        // // Create subcategories
        // foreach (Category::all() as $category) {
        //     Category::factory()->count(2)->create(['parent_id' => $category->id]);
        // }

        // Product::factory()->count(20)->create(); // Creates 20 products
        // Cart::factory()->count(10)->create();
        // CartItem::factory()->count(50)->create();
        // Order::factory()->count(15)->create();
        // OrderItem::factory()->count(50)->create();
        // Payment::factory()->count(15)->create();
        // Review::factory()->count(30)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
