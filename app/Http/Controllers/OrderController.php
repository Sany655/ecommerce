<?php

namespace App\Http\Controllers;

use App\Mail\OrderInvoiceMail;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    function orderInvoice($order_token)
    {
        // $decyptedOrderId = Crypt::decryptString($orderId);
        $order = Order::where('order_token', $order_token)->with(['orderItems' => function ($q) {
            return $q->with(['product', 'coupon']);
        }])->with('coupon')->first();
        return Inertia::render('OrderInvoice', ['order' => $order, 'order_token' => $order_token]);
    }

    public function index()
    {
        $orders = Order::with('orderItems.product')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/ManageOrder', ['orders' => $orders]);
    }

    public function placeOrder(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'nullable|string|email|max:255|unique:users',
            'address' => 'required|string|max:100',
            'division' => 'required|string|max:50',
            'mobile' => ['required', 'string', 'max:15', 'regex:/^(?:\+?88)?01[3-9]\d{8}$/'],
            'notes' => 'nullable|string|max:255',
            'payment_method' => ['required', 'string', 'max:50', Rule::in(['cash_on_delivery', 'bkash'])],
            'payment_status' => 'string|max:20',
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
        $orderToken = $cartToken;
        DB::beginTransaction();
        try {
            $order = Order::create([
                'order_token' => $orderToken,
                'name' => $validate['name'],
                'email' => $validate['email'],
                'address' => $validate['address'],
                'division' => $validate['division'],
                'mobile' => $validate['mobile'],
                'notes' => $validate['notes'],
                'total_price' => $cart->total_amount + $validate['shipping_cost'],
                'coupon_id' => $cart->coupon_id,
                'payment_method' => $validate['payment_method'],
                'payment_status' => $validate['payment_status'],
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
                Cookie::queue('order_token', $orderToken, 15);
                if (filter_var($order->email, FILTER_VALIDATE_EMAIL)) {
                    try {
                        Mail::to($order->email)->send(new OrderInvoiceMail($order));
                    } catch (\Throwable $th) {
                        Log::info(['error' => 'Failed to send invoice', 'error' => $th->getMessage()]);
                    }
                }
            }
            $cart->delete();
            DB::commit();
            return redirect()->route('home.order_invoice', $orderToken);
        } catch (\Exception $e) {
            DB::rollBack();
            return Inertia::render('Checkout')->with(['error' => 'Failed to place order, try again later.']);
        }
    }

    function onlinePayment(Request $request)
    {
        $orderToken = $request->cookie('cart_token');
        $headers = [
            "Content-Type" => "application/json",
            "Accept" => "application/json",
            "Authorization" => Cache::get("bkash_id_token"),
            "X-App-Key" => config("bkash.app_key")
        ];
        $content = [
            "mode" => "0011",
            "payerReference" => config("bkash.app_secret"),
            "callbackURL" => route('home.checkout'),
            "amount" => $request->total_amount,
            "currency" => "BDT",
            "intent" => "sale",
            "merchantInvoiceNumber" => $orderToken
        ];
        $endpoint = config("bkash.base_url") . "/create";
        $response = Http::withHeaders($headers)->post($endpoint, $content);
        if ($response["statusCode"] == "0000") {
            return $response->json();
        } else {
            Log::info($response);
            return response()->json(['message' => 'Create payment failed! try again later.'], 500);
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
