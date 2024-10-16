<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Admin/ManageCategory', ["categories" => Category::all()]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function create()
    // {

    // }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'attributes' => 'nullable|string|max:100',
            'banner' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('category', 'public');
        }

        Category::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'attributes' => $request->input('attributes'),
            'banner' => $bannerPath,
            'parent_id' => $request->input('parent_id'),
            'status' => $request->input('status'),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        return Inertia::render('Admin/ManageCategoryProducts', ['category' => $category->with('products.category')->find($category->id)]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    // public function edit(Category $category)
    // {

    // }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'attributes' => 'nullable|string|max:100',
            'banner' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('banner')) {
            // Delete the old banner if it exists
            if ($category->banner) {
                Storage::disk('public')->delete($category->banner);
            }

            // Upload the new banner
            $bannerPath = $request->file('banner')->store('category', 'public');
            $category->banner = $bannerPath;
        }

        // Update the category with the validated data
        $category->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'attributes' => $validated['attributes'] ?? null,
            'banner' => $category->banner, // New banner or old banner
            'parent_id' => $validated['parent_id'] ?? null, // Set parent_id to null if not provided
            'status' => $validated['status'], // Update status field
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $this->deleteCategoryWithSubcategories($category);
    }

    private function deleteCategoryWithSubcategories(Category $category)
    {
        // Delete category's banner if it exists
        if ($category->banner && Storage::disk('public')->exists($category->banner)) {
            Storage::disk('public')->delete($category->banner);
        }

        // Delete all associated products and their images
        $category->products()->each(function ($product) {
            foreach (json_decode($product->images) as $key => $image) {
                if ($image && Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }
        });

        // Recursively delete subcategories and their images/products
        $category->subcategories()->each(function ($subcategory) {
            // Recursively delete subcategory and all its nested subcategories and products
            $this->deleteCategoryWithSubcategories($subcategory);
        });

        // Finally, delete the category itself
        $category->delete();
    }

    function getAll()
    {
        return Category::all();
    }
}
