<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        // Validate input data
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'short_description' => 'nullable|string|max:40000',
            'description' => 'nullable|string|max:4000000000',
            'variants' => 'nullable|json',
            'price' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'discount_price' => [
                'nullable',
                'numeric',
                function ($attribute, $value, $fail) {
                    if ($value >= request('price')) {
                        $fail('The discount price must be less than the price.');
                    }
                },
            ],
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,png,jpeg,gif|max:2048',
            'status' => 'boolean',
        ]);

        $imagePaths = []; // Array to store image paths
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // Store each file in 'public/product' directory and save the path
                $imagePaths[] = $file->store('product', 'public');
            }
        }

        // Create the product with image paths as a JSON string (or modify to suit your schema)
        Product::create([
            'name' => $request->input('name'),
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'variants' => $request->input('variants'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'category_id' => $request->input('category_id'),
            'images' => json_encode($imagePaths),
            'status' => $request->input('status'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'short_description' => 'nullable|string|max:40000',
            'description' => 'nullable|string|max:4000000000',
            'variants' => 'nullable|json',
            'price' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'discount_price' => [
                'nullable',
                'numeric',
                function ($attribute, $value, $fail) {
                    if ($value >= request('price')) {
                        $fail('The discount price must be less than the price.');
                    }
                },
            ],
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,png,jpeg,gif|max:2048',
            'status' => 'boolean',
        ]);

        // Handle image upload
        $existingImages = json_decode($product->images, true) ?? []; // Get existing images as an array
        $newImagePaths = []; // Array to store new image paths

        // Check if new images are uploaded
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // Store each new file in 'public/product' and save the path
                $newImagePaths[] = $file->store('product', 'public');
            }
        }

        // Combine the existing images with the newly uploaded ones (while keeping max of 10 images)
        $allImages = array_merge($existingImages, $newImagePaths);
        $allImages = array_slice($allImages, 0, 10); // Ensure a maximum of 10 images

        // Update the product with the new data
        $product->update([
            'name' => $request->name,
            'short_description' => $request->short_description,
            'description' => $request->description,
            'variants' => $request->variants,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'images' => json_encode($allImages),
            'status' => $request->status,
        ]);
    }


    public function destroy(Product $product)
    {
        foreach (json_decode($product->images) as $key => $image) {
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }
        }
        $product->delete();
        return redirect()->back();
    }

    function deleteImage(Request $request, $productId)
    {
        $prod = Product::where('id', $productId)->first();
        $updatedImages = [];
        foreach (json_decode($prod->images) as $key => $image) {
            if ($image != $request->img) {
                $updatedImages[] = $image;
            } else {
                if ($image && Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }
        }
        $prod->images = json_encode($updatedImages);
        $prod->save();
        return redirect()->back();
    }
}
