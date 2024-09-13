<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FrontController extends Controller
{
    public function index()
    {
        return Inertia::render('Index', [
            'categories' => Category::where('status', true)
                ->limit(4)
                ->with('subcategories')
                ->get()
                ->map(function ($category) {
                    $category->products = $category->products()->where('status', true)->take(12)->get();
                    return $category;
                }),
            'banner' => Category::all(),
        ]);
    }

    public function show($catId)
    {
        $catWithProd = Category::where(['id' => $catId])->with(['products' => function ($query) {
            $query->where('status', true);
        }])->first();
        return Inertia::render('AllProducts', ['category' => $catWithProd]);
    }

    function show_product(Request $request, $prodId)
    {
        $product = Product::where(['id' => $prodId])->with('category')->first();
        return Inertia::render('ProductDetail', compact('product'));
    }

    function related_products()
    {
        return Product::where('category_id', request('catId'))->where('status', true)->limit(8)->get();
    }
}
