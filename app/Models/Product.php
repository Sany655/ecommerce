<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItem()
    {
        return $this->hasOne(CartItem::class);
    }

    public function orderItem()
    {
        return $this->hasOne(OrderItem::class);
    }

    /**
     * Get the coupon that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'product_coupon');
    }
}
