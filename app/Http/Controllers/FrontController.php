<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FrontController extends Controller
{
    public function applyCoupon(Request $request)
    {
        $cartToken = $request->cookie('cart_token');
        $couponCode = $request->input('coupon_code');
        $cart = Cart::where('cart_token', $cartToken)->first();
        $coupon = Coupon::where('code', $couponCode)
            ->where('status', true)
            ->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        } elseif ($cart->coupon_id) {
            return response()->json(['message' => 'Coupon has already been applied to this cart.'], 400);
        } elseif (!$coupon) {
            return response()->json(['message' => 'Invalid coupon.'], 400);
        } elseif ($coupon->expiry_date && $coupon->expiry_date < now()) {
            return response()->json(['message' => 'Coupon has expired.'], 400);
        } elseif ($coupon->minimum_purchase && $cart->total_amount < $coupon->minimum_purchase) {
            return response()->json(['message' => "Minimum purchase amount is {$coupon->minimum_purchase} to use this coupon!"], 400);
        } else {
            if ($coupon->type == 'fixed') {
                $discount = $coupon->value;
            } else {
                $discount = ($coupon->value / 100) * $cart->total_amount;
            }
            $cart->coupon_id = $coupon->id;
            $cart->total_amount -= $discount;
            $cart->save();
            return response()->json([
                'message' => "Coupon applied successfully! you got a discount of {$discount} on your cart total.",
                'coupon_id' => $coupon->id,
                'discount' => $discount,
                'coupon' => $coupon,
            ]);
        }
    }



    function search($query)
    {
        $prods = Product::where('name', 'LIKE', '%' . $query . '%')->where('status', true)->get();
        return Inertia::render('SearchProducts', ['products' => $prods]);
    }

    public function index()
    {
        return Inertia::render('Index', [
            'categories' => Category::where('status', true)
                ->limit(4)
                ->with('subcategories')
                ->get()
                ->map(function ($category) {
                    $category->products = $category->products()->where('status', true)->take(12)->get();
                    return $category;
                }),
            'banner' => Category::all(),
        ]);
    }

    public function show($catId)
    {
        $catWithProd = Category::where(['id' => $catId])->with(['products' => function ($query) {
            $query->where('status', true);
        }])->first();
        if (!$catWithProd) {
            return abort(404);
        }
        return Inertia::render('AllProducts', ['category' => $catWithProd]);
    }

    function show_product(Request $request, $prodId)
    {
        $product = Product::where(['id' => $prodId])->with('category')->first();
        if (!$product) {
            return abort(404);
        }
        return Inertia::render('ProductDetail', compact('product'));
    }

    function related_products()
    {
        return Product::where('category_id', request('catId'))->where('status', true)->limit(8)->get();
    }
}
