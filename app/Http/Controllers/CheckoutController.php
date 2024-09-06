<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = auth()->user()->cart()->with('cartItems.product')->first();
        return view('checkout.index', compact('cart'));
    }

    public function store(Request $request)
    {
        $cart = auth()->user()->cart()->with('cartItems.product')->first();
        $order = Order::create([
            'user_id' => auth()->id(),
            'total_price' => $cart->cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            }),
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'shipping_address' => $request->shipping_address,
        ]);

        foreach ($cart->cartItems as $cartItem) {
            $order->orderItems()->create([
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->product->price,
            ]);
        }

        $cart->delete(); // Clear the cart after order

        return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully.');
    }
}
