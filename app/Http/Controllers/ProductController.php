<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ManageProduct', ['products' => Product::with('category')->paginate(10)]);
    }

    public function store(Request $request)
    {
        // Validate input data
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string|max:500',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array|max:10', // Ensure max of 10 files
            'images.*' => 'image|mimes:jpg,png,jpeg,gif|max:2048', // Validate each image
            'coupon_code' => 'nullable|string|max:255',
            'coupon_price' => 'nullable|numeric',
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
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'category_id' => $request->input('category_id'),
            'images' => json_encode($imagePaths), // Storing images as JSON if using a single column
            'coupon_code' => $request->input('coupon_code'),
            'coupon_price' => $request->input('coupon_price'),
            'status' => $request->input('status'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id, // Exclude the current product from the unique check
            'description' => 'required|string|max:500',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array|max:10', // Ensure max of 10 files
            'images.*' => 'image|mimes:jpg,png,jpeg,gif|max:2048', // Validate each image
            'coupon_code' => 'nullable|string|max:255',
            'coupon_price' => 'nullable|numeric',
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
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'images' => json_encode($allImages), // Store updated images as JSON
            'coupon_code' => $request->coupon_code,
            'coupon_price' => $request->coupon_price,
            'status' => $request->status,
        ]);

        // Optionally, remove images if desired
        // This can be implemented if the user wants to delete specific images.
        // Example: You can pass an array of image paths to be deleted and handle them here.
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

    function deleteImage(Request $request,$productId) {
        $prod = Product::where('id',$productId)->first();
        $updatedImages = [];
        foreach (json_decode($prod->images) as $key => $image) {
            if($image!= $request->img){
                $updatedImages[] = $image;
            }else{
                Storage::disk('public')->delete($image);
            }
        }
        $prod->images = json_encode($updatedImages);
        $prod->save();
        Log::info($prod);
        return redirect()->back();
    }
}
