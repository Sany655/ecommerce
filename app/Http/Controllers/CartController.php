<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartController extends Controller
{
    // Function to show cart items for a specific token
    public function showCart(Request $request)
    {
        $cartToken = $request->cookie('cart_token');
        if (!$cartToken) {
            return response()->json(['message' => 'No cart token found'], 404);
        } else {
            $cart = Cart::with(['cartItems' => function ($q) {
                $q->with(['product', 'coupon']);
            }])->with('coupon')->where('cart_token', $cartToken)->first();
            if (!$cart) {
                return response()->json(['cart' => null, 'message' => 'Cart is empty']);
            } else {
                return response()->json(['cart' => $cart], 200);
            }
        }
    }


    // Function to add an item to the cart
    public function addToCart(Request $request)
    {
        try {
            $cartToken = $request->cookie('cart_token');
            $productId = $request->input('product_id');
            $quantity = $request->input('quantity');
            $variants = $request->input('variants');

            // Find or create a cart based on the cart token
            $cart = Cart::where('cart_token', $cartToken)->firstOrCreate(['cart_token' => $cartToken]);

            // Find if the same product with the same variants exists in the cart
            $cartItem = $cart->cartItems()
                ->where('product_id', $productId)
                ->where('variants', $variants)
                ->first();

            if ($cartItem) {
                $cartItem->quantity = $quantity;
                $cartItem->subtotal = $quantity * ($cartItem->product->discount_price ?? $cartItem->product->price);
                $cartItem->save();
            } else {
                $prod = Product::find($productId);
                $subtotal = $quantity * ($prod->discount_price ?? $prod->price);

                $cart->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                    'variants' => $variants,
                ]);
            }

            // Update the total amount of the cart
            $cart->total_amount = $cart->cartItems()->sum('subtotal');
            $cart->save();

            // Return the whole cart with cart items and corresponding products
            return response()->json([
                'cart' => $cart->load('cartItems.product', 'cartItems.coupon', 'coupon')
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 500);
        }
    }



    // Function to remove an item from the cart
    public function removeFromCart(Request $request, $itemId)
    {
        $cartToken = $request->cookie('cart_token');

        // Check if the cart exists
        $cart = Cart::where('cart_token', $cartToken)->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        // Find the cart item by its ID
        $cartItem = $cart->cartItems()->where('id', $itemId)->first();
        if ($cartItem) {
            // Subtract the subtotal of the item from the total amount of the cart
            $cart->total_amount -= $cartItem->subtotal;

            // If the total amount becomes negative (edge case), reset it to 0
            $cart->total_amount = max(0, $cart->total_amount);

            // Save the updated cart and remove the cart item
            $cart->save();
            $cartItem->delete();

            // If all cart items are removed, reset the total amount to 0
            if ($cart->cartItems()->count() === 0) {
                $cart->total_amount = 0;
                $cart->save();
            }

            return response()->json(['message' => 'Item removed from cart']);
        }

        // Return a 404 if the item is not found
        return response()->json(['message' => 'Item not found'], 404);
    }


    // Clear all items from the cart
    public function clearCart(Request $request)
    {
        $cartToken = $request->cookie('cart_token');
        $cart = Cart::where('cart_token', $cartToken)->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        $cart->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
