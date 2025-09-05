<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    function index() {
        $orders = Order::where(['status' => 'delivered'])->where('updated_at', '>=', now()->startOfDay())->count();
        $users = Order::all('mobile')->groupBy('mobile')->count();
        return Inertia::render('Admin/Dashboard', [
            'orders' => $orders,
            'users' => $users,
            'revenue' => Order::where(['status' => 'delivered'])->sum('total_price'),
            'pending_shipments' => Order::where(['status' => 'pending'])->count(),
        ]);
    }
}
