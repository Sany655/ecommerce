<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ManageProduct', ['products' => Product::with('category')->paginate(10)]);
    }

    public function create()
    {
        return view('products.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048',
            'coupon_code' => 'nullable|string|max:255',
            'coupon_price' => 'nullable|numeric',
            'status' => 'boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Store the file in 'public/category' and get the relative path
            $imagePath = $request->file('image')->store('product', 'public');
        }

        Product::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'category_id' => $request->input('category_id'),
            'image' => $imagePath,
            'coupon_code' => $request->input('coupon_code'),
            'coupon_price' => $request->input('coupon_price'),
            'status' => $request->input('status'),
        ]);
        // return redirect()->route('product.index');
    }

    public function show(Product $product)
    {
        return view('product.show', compact('product'));
    }

    public function edit(Product $product)
    {
        return view('product.edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id, // Exclude the current product from unique check
            'description' => 'required|string',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048',
            'coupon_code' => 'nullable|string|max:255',
            'coupon_price' => 'nullable|numeric',
            'status' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            // Upload the new image
            $imagePath = $request->file('image')->store('product', 'public');
            $product->image = $imagePath; // Update the product image path
        }

        // Update other product fields
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'image' => $product->image ?? $product->image,
            'coupon_code' => $request->coupon_code,
            'coupon_price' => $request->coupon_price,
            'status' => $request->status,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
    }
}