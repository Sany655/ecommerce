<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    function index() {
        $orders = Order::where(['status' => 'delivered'])->where('updated_at', '>=', now()->startOfDay())->count();
        $users = Order::all('mobile')->groupBy('mobile')->count();

        $totalOrders = DB::table('orders')->count();
        $pendingOrders = DB::table('orders')->where('status', 'pending')->count();
        $deliveredOrders = DB::table('orders')->where('status', 'delivered')->count();
        $cancelledOrders = DB::table('orders')->where('status', 'cancelled')->count();
        $totalRevenue = DB::table('orders')
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');

        $todayRevenue = DB::table('orders')
            ->whereDate('created_at', today())
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');

        $monthlyRevenue = DB::table('orders')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');
        $totalProducts = DB::table('products')->count();
        $topSelling = DB::table('products')->orderByDesc('sold')->limit(5)->get();
        $totalCustomers = DB::table('orders')->distinct('mobile')->count('mobile');
        $newCustomersThisMonth = DB::table('orders')
            ->whereMonth('created_at', now()->month)
            ->distinct('mobile')
            ->count('mobile');
        $activeCoupons = DB::table('coupons')->where('status', 1)->count();
        $activeCarts = DB::table('carts')->count();






        return Inertia::render('Admin/Dashboard', [
            // 'orders' => $orders,
            // 'users' => $users,
            // 'revenue' => Order::where(['status' => 'delivered'])->sum('total_price'),
            // 'pending_shipments' => Order::where(['status' => 'pending'])->count(),
            'orders' => [
                'total' => $totalOrders,
                'pending' => $pendingOrders,
                'delivered' => $deliveredOrders,
                'cancelled' => $cancelledOrders,
            ],
            'revenue' => [
                'total' => $totalRevenue,
                'today' => $todayRevenue,
                'month' => $monthlyRevenue,
            ],
            'products' => [
                'total' => $totalProducts,
                'topSelling' => $topSelling,
            ],
            'customers' => [
                'total' => $totalCustomers,
                'newThisMonth' => $newCustomersThisMonth,
            ],
            'coupons' => $activeCoupons,
            'carts' => $activeCarts,
        ]);
    }
}
