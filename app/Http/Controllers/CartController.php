<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartController extends Controller
{
    // Function to show cart items for a specific token
    public function showCart(Request $request)
    {
        // Retrieve cart token from request (frontend should send it)
        $cartToken = $request->cookie('cart-token');

        if (!$cartToken) {
            return response()->json(['message' => 'No cart token found']);
        }

        $cart = Cart::where('cart_token', $cartToken)->first();

        if (!$cart) {
            return response()->json(['cart' => [], 'message' => 'Cart is empty']);
        }

        $cartItems = $cart->cartItems()->with('product')->get(); // Assuming CartItem has a relation to Product
        return response()->json(['cart' => $cartItems]);
    }

    // Function to add an item to the cart
    public function addToCart(Request $request)
    {
        $cartToken = $request->cookie('cart-token');
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);
        $cart = Cart::where('cart_token', $cartToken)->firstOrCreate(['cart_token' => $cartToken]);
        $cartItem = $cart->cartItems()->where('product_id', $productId)->first();
        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();
        } else {
            $cart->cartItems()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }
        $cart = Cart::where('cart_token', $cartToken)->first();
        $cartItems = $cart->cartItems()->with('product')->get();
        return response()->json(['cart' => $cartItems]);
    }



    // Function to remove an item from the cart
    public function removeFromCart(Request $request, $itemId)
    {
        $cartToken = $request->cookie('cart-token');
        $cart = Cart::where('cart_token', $cartToken)->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        $cartItem = $cart->cartItems()->where('id', $itemId)->first();
        if ($cartItem) {
            $cartItem->delete();
            return response()->json(['message' => 'Item removed from cart']);
        }
        return response()->json(['message' => 'Item not found'], 404);
    }

    // Clear all items from the cart
    public function clearCart(Request $request)
    {
        $cartToken = $request->cookie('cart-token');
        $cart = Cart::where('cart_token', $cartToken)->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        $cart->cartItems()->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
