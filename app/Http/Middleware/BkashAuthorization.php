<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BkashAuthorization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = [];
        $id_token = Cache::get('bkash_id_token');
        $refresh_token = Cache::get('bkash_refresh_token');
        if (!$id_token) {
            $headers = [
                "Content-Type" => "application/json",
                "Accept" => "application/json",
                "username" => config("bkash.user"),
                "password" => config("bkash.pass")
            ];
            $content = array_merge([
                "app_key" => config("bkash.app_key"),
                "app_secret" => config("bkash.app_secret"),
            ], $refresh_token ? ["refresh_token" => $refresh_token] : []);
            $endpoint = config("bkash.base_url") . ($refresh_token ? "/token/refresh" : "/token/grant");
            $response = Http::withHeaders($headers)->post($endpoint, $content);
            if ($response->successful()) {
                $body = json_decode($response->body(), true);
                Cache::put('bkash_id_token', $body["id_token"], $body["expires_in"]);
                Cache::put('bkash_refresh_token', $body["refresh_token"], 60 * 60 * 24 * 28);
            } else {
                return Inertia::render('Checkout')->with(['error' => 'Authentication failed! Try again later.']);
            }
        }
        return $next($request);
    }
}
