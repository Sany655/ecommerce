<?php

namespace App\Http\Controllers;

use App\Mail\OrderInvoiceMail;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusNote;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
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
        $order = Order::where('order_token', $order_token)->with(['orderItems' => function ($q) {
            return $q->with(['product', 'coupon']);
        }])->with('coupon')->first();
        if ($order) {
            return Inertia::render('OrderInvoice', ['order' => $order, 'order_token' => $order_token, 'app_url' => config('app.url')]);
        } else return abort(404);
    }

    public function index()
    {
        $orders = Order::with(['orderItems.product', 'order_notes.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return Inertia::render('Admin/ManageOrder', ['orders' => $orders]);
    }

    public function deleteOrder(Request $request)
    {
        try {
            $orderId = $request->orderId;
            $order = Order::find($orderId);
            if ($order) {
                $order->orderItems()->delete();
                $order->order_notes()->delete();
                $order->delete();
                return response()->json(['message' => 'Order deleted successfully'], 200);
            } else {
                return response()->json(['message' => 'Order not found'], 404);
            }
        } catch (\Throwable $th) {
            Log::info(['message' => 'Failed to delete order', 'error' => $th->getMessage()]);
            return response()->json(['message' => 'Failed to delete order', 'error' => $th->getMessage()], 500);
        }
    }

    public function placeOrder(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'nullable|string|email|max:255',
            'address' => 'required|string|max:100',
            'division' => 'required|string|max:50',
            'mobile' => ['required', 'string', 'max:15', 'regex:/^(?:\+?88)?01[3-9]\d{8}$/'],
            'notes' => 'nullable|string|max:255',
            'payment_method' => ['required', 'string', 'max:50', Rule::in(['cash_on_delivery', 'bkash'])],
            'payment_status' => 'nullable|string|max:20',
            'shipping_cost' => 'required|numeric|min:0',
        ]);

        $cartToken = $request->cookie('cart_token');
        $cart = Cart::with('cartItems')->where('cart_token', $cartToken)->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            session()->flash('error', 'Cart is empty or invalid');
            return redirect()->route('home.checkout');
        }

        // Check for existing order token if in production
        if (app()->environment('production') && $request->cookie('order_token') === $cartToken) {
            session()->flash('error', 'if u want any kind of information please call us - 01854846414');
            return redirect()->route('home.checkout');
        }

        DB::beginTransaction();
        try {
            // Create Order
            $order = Order::create([
                'order_token' => $cartToken,
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'address' => $validatedData['address'],
                'division' => $validatedData['division'],
                'mobile' => $validatedData['mobile'],
                'notes' => $validatedData['notes'],
                'total_price' => $cart->total_amount + $validatedData['shipping_cost'],
                'coupon_id' => $cart->coupon_id,
                'payment_method' => $validatedData['payment_method'],
                'payment_status' => $validatedData['payment_status'] ?? 'pending',
                'status' => 'pending',
            ]);

            // Bulk insert OrderItems
            $orderItems = $cart->cartItems->map(function ($item) use ($order) {
                return [
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'coupon_id' => $item->coupon_id,
                    'variants' => $item->variants,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                ];
            })->toArray();
            OrderItem::insert($orderItems);
            // Clear the cart
            $cart->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order placement failed', ['error' => $e->getMessage()]);
            session()->flash('error', 'Failed to place order, try again later.');
            return redirect()->route('home.checkout');
        }

        // Set order token cookie if in production
        if (app()->environment('production')) {
            Cookie::queue('order_token', $cartToken, 15);
            // if ($order->email) {
            //     try {
            //         Mail::to($order->email)->queue(new OrderInvoiceMail($order));
            //     } catch (\Exception $e) {
            //         Log::error('Sending email failed', ['error' => $e->getMessage()]);
            //     }
            // }
        }

        $newToken = (string) Str::uuid();
        return redirect()->route('home.order_invoice', $cartToken)->cookie('cart_token', $newToken, 60 * 24 * 30);;
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

    function changeOrderStatus(Request $request)
    {
        try {
            $orderId = $request->orderId;
            $payment_status = $request->status === "delivered" ? "paid" : "pending";
            $order = Order::find($orderId);
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }
            if (app()->environment('production') && $request->status === 'delivered') {
                $order->increment(['sold']);
            }
            $order->update(['status' => $request->status, 'payment_status' => $payment_status]);
            OrderStatusNote::create([
                'order_id' => $orderId,
                'user_id' => $request->user,
                'status' => $request->status,
                'note' => $request->note,
            ]);
            // $order = Order::with(['orderItems.product', 'orderItems.coupon', 'coupon'])->find($orderId);
            // if ($order->status === 'processing' && $order->email) {
            //     try {
            //         Mail::to($order->email)->send(new OrderInvoiceMail($order));
            //     } catch (\Throwable $th) {
            //         Log::info(['message' => 'Failed to send invoice after change order status', 'error' => $th->getMessage()]);
            //     }
            // }
            // return response()->json(['status' => $order->status], 200);
        } catch (\Throwable $th) {
            Log::info(['message' => 'Failed to update order status', 'error' => $th->getMessage()]);
            return response()->json(['message' => 'Failed to update order status', 'error' => $th->getMessage()], 500);
        }
    }

    function predictOrder(Request $request)
    {
        try {
            $orderId = $request->orderId;
            $order = Order::find($orderId);
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }
            if (file_exists(storage_path('app/ml_model.phpml'))) {
                $classifier = unserialize(file_get_contents(storage_path('app/ml_model.phpml')));

                $divisionNum = $order->division == 'Dhaka' ? 1 : ($order->division == 'Chittagong' ? 2 : ($order->division == 'Khulna' ? 3 : ($order->division == 'Rajshahi' ? 4 : ($order->division == 'Barisal' ? 5 : ($order->division == 'Sylhet' ? 6 : ($order->division == 'Rangpur' ? 7 : ($order->division == 'Mymensingh' ? 8 : 9)))))));

                $priceBucket = floor($order->total_price / 1000);
                $prediction = $classifier->predict([$divisionNum, $priceBucket, strlen($order->address)]);
                Log::info(['message' => 'Order prediction', 'order_id' => $orderId, 'prediction' => $prediction]);
                return response()->json(['prediction' => $prediction], 200);
            } else {
                return response()->json(['message' => 'Model not found'], 500);
            }
        } catch (\Throwable $th) {
            Log::info(['message' => 'Failed to predict order', 'error' => $th->getMessage()]);
            return response()->json(['message' => 'Failed to predict order', 'error' => $th->getMessage()], 500);
        }
    }
}
