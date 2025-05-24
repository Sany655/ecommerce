<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class SettingController extends Controller
{
    function index()
    {
        return Inertia::render('Admin/ManageSite');
    }

    function companyInfoUpdate(Request $request)
    {
        $data = $request->validate([
            'name' => 'string|max:255|nullable',
            'description' => 'string|max:255|nullable',
            'motto' => 'string|max:255|nullable',
        ]);
        $user = User::where('role', 'admin')->first();
        $publicInfo = json_decode($user->public_info, true) ?? [];
        $publicInfo['company'] = [
            'name' => $data['name'] ?? "",
            'description' => $data['description'] ?? "",
            'motto' => $data['motto'] ?? "",
        ];
        $user->public_info = json_encode($publicInfo);
        $user->save();
    }

    function contactInfoUpdate() {
        $data = request()->validate([
            'email' => 'string|email|max:255|nullable',
            'phone' => 'string|max:20|nullable',
            'address' => 'string|max:255|nullable',
        ]);

        $user = User::where('role', 'admin')->first();
        $publicInfo = json_decode($user->public_info, true) ?? [];
        $publicInfo['contact'] = [
            'email' => $data['email'] ?? "",
            'phone' => $data['phone'] ?? "",
            'address' => $data['address'] ?? "",
        ];
        $user->public_info = json_encode($publicInfo);
        $user->save();
    }

    function socialInfoUpdate()
    {
        $user = User::where('role', 'admin')->first();
        $publicInfo = json_decode($user->public_info, true) ?? [];
        $publicInfo['social_media'] = request()->social_media ?? [];
        $user->public_info = json_encode($publicInfo);
        $user->save();
    }

    function paymentInfoUpdate()
    {
        $user = User::where('role', 'admin')->first();
        $publicInfo = json_decode($user->public_info, true) ?? [];
        $publicInfo['payment_methods'] = request()->payment_methods ?? [];
        $user->public_info = json_encode($publicInfo);
        $user->save();
        
    }

    function colorInfoUpdate()
    {
        $user = User::where('role', 'admin')->first();
        $publicInfo = json_decode($user->public_info, true) ?? [];
        $publicInfo['theme'] = request()->theme ?? [];
        $user->public_info = json_encode($publicInfo);
        $user->save();
    }

    function logoAndFaviconUpload(Request $request){
        $request->validate([
            'logo' => 'image|mimes:jpeg,png,jpg,gif|max:2048|nullable',
            'favicon' => 'image|mimes:jpeg,png,jpg,gif|max:2048|nullable',
        ]);

        $logoPath = 'setting/logo.png';
        $faviconPath = 'setting/favicon.png';

        if ($request->hasFile('logo')) {
            if (\Storage::disk('public')->exists($logoPath)) {
            \Storage::disk('public')->delete($logoPath);
            }
            $uploadedLogo = $request->file('logo');
            \Storage::disk('public')->putFileAs('setting', $uploadedLogo, 'logo.png');
        }

        if ($request->hasFile('favicon')) {
            if (\Storage::disk('public')->exists($faviconPath)) {
            \Storage::disk('public')->delete($faviconPath);
            }
            $uploadedFavicon = $request->file('favicon');
            \Storage::disk('public')->putFileAs('setting', $uploadedFavicon, 'favicon.png');
        }
    }
}
