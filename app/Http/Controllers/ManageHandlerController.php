<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use \App\Models\User;
use Illuminate\Auth\Events\Registered;

class ManageHandlerController extends Controller
{
    function index() {
        return inertia('Admin/ManageOrderHandlers', [
            'orderHandler' => User::where('role', 'order_handler')->get()
        ]);
    }

    public function store(Request $request)
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

        event(new Registered($user));
    }

    function destroy($id) {
        $user = User::find($id);
        if ($user && $user->role === 'order_handler') {
            $user->delete();
        }
    }
}
