<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            // 'name' => $this->faker->name,
            'name' => "admin",
            // 'email' => $this->faker->unique()->safeEmail,
            'email' => "admin@example.com",
            'password' => Hash::make('asdfasdf'), // or use bcrypt('password')
            // 'role' => $this->faker->randomElement(['customer', 'admin']),
            'role' => $this->faker->randomElement(['admin']),
            'address' => $this->faker->address,
            'phone_number' => $this->faker->phoneNumber,
            'public_info' => json_encode([
                "company" => [
                    "name" => "Islamic Lifestyle Brand in Bangladesh",
                    "description" => "Online Based Premium Islamic Lifestyle Shop.",
                    "motto" => "Ad dawah bit-teezarah. Dawah by business."
                ],
                "contact" => [
                    "phone" => "+88 01854846414",
                    "email" => "Info@hamdaanz.com"
                ],
                "payment_methods" => ["bkash"],
                "social_media" => [
                    ["name"=>"tiktok","link"=> "https://www.tiktok.com/@hamdaanz"],
                    ["name"=>"facebook","link"=> "https://www.facebook.com/hamdaanz"],
                    ["name"=>"instagram","link"=> "https://www.instagram.com/hamdaanz"],
                    ["name"=>"youtube","link"=> "https://www.youtube.com/@hamdaanz"],
                    ["name"=>"linkedin","link"=> "https://www.linkedin.com/company/hamdaanz"],
                    ["name"=>"twitter","link"=> "https://twitter.com/hamdaanz"],
                    ["name"=>"pinterest","link"=> "https://www.pinterest.com/hamdaanz"],
                    ["name"=>"website","link"=> "https://hamdaanz.com"],
                    ["name"=>"blog","link"=> "https://hamdaanz.com/blog"],
                    ["name"=>"whatsapp","link"=> "https://wa.me/8801854846414"],
                    ["name"=>"telegram","link"=> "https://t.me/hamdaanz"],
                    ["name"=>"snapchat","link"=> "https://www.snapchat.com/add/hamdaanz"],
                    ["name"=>"twitch","link"=> "https://www.twitch.tv/hamdaanz"],
                    ["name"=>"discord","link"=> "https://discord.gg/hamdaanz"],
                ],
                "legal" => [
                    "copyright" => "© 2025",
                    "all_rights_reserved" => true,
                    "domain" => "ecommerce.com",
                ]
            ]),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
