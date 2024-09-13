<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'banner' => 'category/' . $this->faker->image(storage_path('app/public/category'), 640, 480, null, false),
            'parent_id' => $this->faker->optional()->randomElement(Category::pluck('id')->toArray()),
            'status' => true,
        ];
    }
}
