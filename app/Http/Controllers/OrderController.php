<?php

namespace App\Http\Controllers;

use App\Mail\OrderInvoiceMail;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        return Inertia::render('OrderInvoice', ['order' => $order->with(['orderItems' => function ($q) {
            return $q->with(['product', 'coupon']);
        }])->with('coupon')->first()]);
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
        $validate = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'nullable|string|email|max:255|unique:users',
            'address' => 'required|string|max:100',
            'division' => 'required|string|max:50',
            'mobile' => ['required', 'string', 'max:15', 'regex:/^(?:\+?88)?01[3-9]\d{8}$/'],
            'notes' => 'nullable|string|max:255',
            'shipping_cost' => 'required|numeric|min:0',
        ]);
        $cartToken = $request->cookie('cart_token');
        $cart = Cart::where('cart_token', $cartToken)->first();
        if (!$cart || $cart->cartItems->isEmpty()) {
            return Inertia::render('Checkout')->with(['error' => 'Cart is empty or invalid']);
        }
        if (app()->environment('production')) {
            $orderToken = $request->cookie('order_token');
            if ($orderToken) {
                return Inertia::render('Checkout')->with(['error' => 'if u want any kind of information please call us - 01854846414']);
            }
        }
        $orderToken = (string) Str::uuid();
        DB::beginTransaction();
        try {
            $order = Order::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'address' => $validate['address'],
                'division' => $validate['division'],
                'mobile' => $validate['mobile'],
                'notes' => $validate['notes'],
                'total_price' => $cart->total_amount + $validate['shipping_cost'],
                'coupon_id' => $cart->coupon_id,
                'status' => 'pending',
            ]);
            foreach ($cart->cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'coupon_id' => $cartItem->coupon_id,
                    'variants' => $cartItem->variants,
                    'quantity' => $cartItem->quantity,
                    'subtotal' => $cartItem->subtotal,
                ]);
            }
            if (app()->environment('production')) {
                Cookie::queue('order_token', $orderToken, 60 * 24 * 5);
            }
            $cart->delete();
            DB::commit();
            return redirect()->route('home.order_invoice', $order->id);
        } catch (\Exception $e) {
            DB::rollBack();
            response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }

    function changeOrderStatus(Request $request, $orderId)
    {
        try {
            Order::where('id', $orderId)->update(['status' => $request->status]);
            $order = Order::with(['orderItems.product', 'orderItems.coupon', 'coupon'])->find($orderId);
            if ($order->status === 'processing' && $order->email) {
                try {
                    Mail::to($order->email)->send(new OrderInvoiceMail($order));
                } catch (\Throwable $th) {
                    Log::info(['message' => 'Failed to send invoice', 'error' => $th->getMessage()]);
                }
            }
            return response()->json(['status' => $order->status], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to update order status', 'error' => $th->getMessage()], 500);
        }
    }
}
