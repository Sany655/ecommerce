<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    function index()
    {
        return Inertia::render('Admin/ManageCoupon', ['coupons' => Coupon::paginate(10)]);
    }

    function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:coupons,name',
            'code' => 'required|string|max:255|unique:coupons,code',
            'value' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'type' => 'required|in:fixed,percentage',
            'expiry_date' => 'date|nullable',
            'minimum_purchase' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'status' => 'required|boolean',
        ]);

        // Create the product with image paths as a JSON string (or modify to suit your schema)
        Coupon::create([
            'name' => $request->input('name'),
            'code' => $request->input('code'),
            'value' => $request->input('value'),
            'type' => $request->input('type'),
            'expiry_date' => $request->input('expiry_date'),
            'minimum_purchase' => $request->input('minimum_purchase'),
            'status' => $request->input('status'),
        ]);
    }

    function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:coupons,name,' . $coupon->id,
            'code' => 'required|string|max:255|unique:coupons,code,' . $coupon->id,
            'value' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'type' => 'required|in:fixed,percentage',
            'expiry_date' => 'date|nullable|after:today',
            'minimum_purchase' => [
                'nullable',
                'numeric',
                'regex:/^\d{1,9}(\.\d{1,2})?$/',  // Up to 99999.99
            ],
            'status' => 'required|boolean',
        ]);
        // Update the product with the new data
        $coupon->update([
            'name' => $request->name,
            'code' => $request->code,
            'value' => $request->value,
            'type' => $request->type,
            'expiry_date' => $request->expiry_date,
            'minimum_purchase' => $request->minimum_purchase,
            'status' => $request->status,
        ]);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return redirect()->back();
    }

    function getAll()
    {
        return Coupon::all();
    }
}
