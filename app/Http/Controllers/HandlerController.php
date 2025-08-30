<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use \App\Models\User;
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

    function getAllOrderHandlers() {
        return inertia('Admin/ManageOrderHandlers', [
            'orderHandler' => User::where('role', 'order_handler')->get()
        ]);
    }

    public function storeOrderHandlers(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'order_handler',
        ]);

        // event(new Registered($user));

        // Auth::login($user);

        // return redirect(RouteServiceProvider::HOME);
    }
}
