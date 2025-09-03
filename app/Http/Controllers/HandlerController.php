<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Order;
use Inertia\Inertia;

class HandlerController extends Controller
{
    public function index()
    {
        $orders = Order::with('orderItems.product')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Handler/Dashboard', [
            'orders' => $orders
        ]);
    }
}
