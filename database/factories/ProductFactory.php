<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->word,
            'description' => $this->faker->paragraph,
            'image' => 'product/' . $this->faker->image(storage_path('app/public/product'), 640, 480, null, false),
            'price' => $price = $this->faker->randomFloat(2, 10, 1000),
            'discount_price' => $price * 0.90,
            'coupon_price' => $price * 0.80,
            'coupon_code' => $this->faker->optional()->word,
            'sold' => $this->faker->numberBetween(0, 1000),
            'views' => $this->faker->numberBetween(0, 1000),
            'status' => true,
        ];
    }
}
