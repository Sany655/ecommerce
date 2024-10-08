<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    function downloadInvoice($orderId)
    {
        $order = Order::where('id', $orderId)->with('orderItems.product')->first();
        if (!$order) {
            abort(404, "Order not found.");
        }

        $pdf = PDF::loadView('order-invoice', ['order' => $order]);
        return $pdf->download('order_invoice.pdf');
    }

    function orderInvoice($orderId)
    {
        $order = Order::where('id', $orderId)->first();
        return Inertia::render('OrderInvoice', ['order' => $order->with('orderItems.product')->first()]);
    }

    public function index()
    {
        $orders = Order::with('orderItems.product')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/ManageOrder', ['orders' => $orders]);
    }

    // public function show(Order $order)
    // {
    //     $order->load('user', 'orderItems.product');
    //     return view('orders.show', compact('order'));
    // }

    public function placeOrder(Request $request)
    {
        // Retrieve the cart using cart_token from the request cookie
        $cartToken = $request->cookie('cart-token');
        $cart = Cart::where('cart_token', $cartToken)->first();

        // Check if the cart exists and contains items
        if (!$cart || $cart->cartItems->isEmpty()) {
            return Inertia::render('Checkout')->with(['error' => 'Cart is empty or invalid']);
        }

        // check if the env is in production environment
        if (app()->environment('production')) {
            $orderToken = $request->cookie('order_token');
            if ($orderToken) {
                return Inertia::render('Checkout')->with(['error' => 'if u want any kind of information please call us - 01854846414']);
            }
        }

        $orderToken = (string) Str::uuid();

        // Start a database transaction to ensure atomicity
        DB::beginTransaction();
        try {
            // Calculate the total price from the cart items
            $totalPrice = 0;
            foreach ($cart->cartItems as $cartItem) {
                // Assuming product has both 'price' and 'discount_price' fields
                $totalPrice += $cartItem->product->discount_price ?? $cartItem->product->price * $cartItem->quantity;
            }
            // Create the order with the data from the request and calculated total_price
            $order = Order::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'address' => $request->input('address'),
                'division' => $request->input('division'),
                'mobile' => $request->input('mobile'),
                'notes' => $request->input('notes'),
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);
            // Loop through the cart items and create corresponding order items
            foreach ($cart->cartItems as $cartItem) {
                Log::info($cartItem->product->discount_price ?? $cartItem->product->price);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->discount_price ?? $cartItem->product->price,
                ]);
            }
            // Commit the transaction
            // Cookie::queue('order_token', $orderToken, 60 * 24 * 5);
            DB::commit();
            return redirect()->route('home.order_invoice', $order->id);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }

    function changeOrderStatus(Request $request, $orderId)
    {
        Order::where('id', $orderId)->update(['status' => $request->status]);
        $updatedOrder = Order::find($orderId);
        return response()->json(['status' => $updatedOrder->status], 200);
    }
}
