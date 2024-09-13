<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::paginate(10)->sortBy('created_at', 'desc')->get();
        return Inertia::render('Admin/ManageOrder', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load('user', 'orderItems.product');
        return view('orders.show', compact('order'));
    }

    public function placeOrder(Request $request)
    {
        // Retrieve the cart using cart_token from the request cookie
        $cartToken = $request->cookie('cart-token');
        $cart = Cart::where('cart_token', $cartToken)->first();

        // Check if the cart exists and contains items
        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty or invalid'], 400);
        }

        // Start a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Calculate the total price from the cart items
            $totalPrice = 0;
            foreach ($cart->cartItems as $cartItem) {
                // Assuming product has both 'price' and 'discount_price' fields
                $productPrice = $cartItem->product->discount_price ?? $cartItem->product->price;
                $totalPrice += $productPrice * $cartItem->quantity;
            }

            // Create the order with the data from the request and calculated total_price
            $order = Order::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'address' => $request->input('address'),
                'division' => $request->input('division'),
                'mobile' => $request->input('mobile'),
                'notes' => $request->input('notes'),
                'total_price' => $totalPrice, // Calculated price
                'status' => 'pending', // default status is pending
            ]);

            // Loop through the cart items and create corresponding order items
            foreach ($cart->cartItems as $cartItem) {
                $productPrice = $cartItem->product->discount_price ?? $cartItem->product->price;
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $productPrice, // Using the correct product price
                ]);
            }

            // Commit the transaction
            DB::commit();
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }
}
