<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get all orders associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     *
     * @return \Illuminate\Database\Eloquent\Collection|\App\Models\Order[]
     *
     * @throws \Exception
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the cart associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     *
     * @return \App\Models\Cart|null The user's cart, or null if the user does not have a cart.
     *
     * @throws \Exception
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
