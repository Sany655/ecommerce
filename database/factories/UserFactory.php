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
                    "name" => "Tawaqqul",
                    "description" => "Shop with Intention. Live with Tawakkul.",
                    "motto" => "Trust. Live. Flourish."
                ],
                "contact" => [
                    "phone" => "+88 01876626011",
                    "email" => "Info@mazharulalam.co"
                ],
                "payment_methods" => ["bkash"],
                "social_media" => [
                    ["name"=>"tiktok","link"=> "https://www.tiktok.com/@mazharulalam"],
                    ["name"=>"facebook","link"=> "https://www.facebook.com/mazharulalam"],
                    ["name"=>"instagram","link"=> "https://www.instagram.com/mazharulalam"],
                    ["name"=>"youtube","link"=> "https://www.youtube.com/@mazharulalam"],
                    ["name"=>"linkedin","link"=> "https://www.linkedin.com/company/mazharulalam"],
                    ["name"=>"twitter","link"=> "https://twitter.com/mazharulalam"],
                    ["name"=>"pinterest","link"=> "https://www.pinterest.com/mazharulalam"],
                    ["name"=>"website","link"=> "https://mazharulalam.com"],
                    ["name"=>"blog","link"=> "https://mazharulalam.com/blog"],
                    ["name"=>"whatsapp","link"=> "https://wa.me/8801854846414"],
                    ["name"=>"telegram","link"=> "https://t.me/mazharulalam"],
                    ["name"=>"snapchat","link"=> "https://www.snapchat.com/add/mazharulalam"],
                    ["name"=>"twitch","link"=> "https://www.twitch.tv/mazharulalam"],
                    ["name"=>"discord","link"=> "https://discord.gg/mazharulalam"],
                ],
                "legal" => [
                    "copyright" => "© 2025",
                    "all_rights_reserved" => true,
                    "domain" => "mazharulalam.co",
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
