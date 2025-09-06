<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Phpml\Classification\KNearestNeighbors;

class DashboardController extends Controller
{
    function index() {

        $ordersForMl = DB::table('orders')
            ->select('address','division', 'total_price', 'status')
            ->whereIn('status', ['delivered', 'cancelled'])
            ->get();

        // Map divisions to numbers
        $divisionMap = [];
        $divisionId = 1;

        $samples = [];
        $labels = [];

        foreach ($ordersForMl as $order) {
            if (!isset($divisionMap[$order->division])) {
                $divisionMap[$order->division] = $divisionId++;
            }

            $divisionNum = $divisionMap[$order->division];
            $priceBucket = floor($order->total_price / 1000); // bucket prices

            $samples[] = [$divisionNum, $priceBucket, strlen($order->address)];
            $labels[] = $order->status;
        }

        // $classifier = $this->get_model($samples, $labels);

        // $newOrder = [
        //     $divisionMap['Dhaka'],   // division number
        //     floor(3500 / 1000),      // price bucket
        //     strlen('Gulshan 1 Road 123, Dhaka') // address length
        // ];

        // $prediction = $classifier->predict($newOrder);

        $chartData = [];
        foreach ($samples as $i => $s) {
            $chartData[] = [
                'division' => $s[0],
                'priceBucket' => $s[1],
                'addressLength' => $s[2],
                'status' => $labels[$i],
            ];
        }

// end ML code here ---------------************************-----------------
       
        $orders = Order::where(['status' => 'delivered'])->where('updated_at', '>=', now()->startOfDay())->count();
        $users = Order::all('mobile')->groupBy('mobile')->count();

        $totalOrders = DB::table('orders')->count();
        $pendingOrders = DB::table('orders')->where('status', 'pending')->count();
        $deliveredOrders = DB::table('orders')->where('status', 'delivered')->count();
        $cancelledOrders = DB::table('orders')->where('status', 'cancelled')->count();
        $totalRevenue = DB::table('orders')
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');

        $todayRevenue = DB::table('orders')
            ->whereDate('created_at', today())
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');

        $monthlyRevenue = DB::table('orders')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->sum('total_price');
        $totalProducts = DB::table('products')->count();
        $topSelling = DB::table('products')->orderByDesc('sold')->limit(5)->get();
        $totalCustomers = DB::table('orders')->distinct('mobile')->count('mobile');
        $newCustomersThisMonth = DB::table('orders')
            ->whereMonth('created_at', now()->month)
            ->distinct('mobile')
            ->count('mobile');
        $activeCoupons = DB::table('coupons')->where('status', 1)->count();
        $activeCarts = DB::table('carts')->count();


        return Inertia::render('Admin/Dashboard', [
            // 'orders' => $orders,
            // 'users' => $users,
            // 'revenue' => Order::where(['status' => 'delivered'])->sum('total_price'),
            // 'pending_shipments' => Order::where(['status' => 'pending'])->count(),
            'orders' => [
                'total' => $totalOrders,
                'pending' => $pendingOrders,
                'delivered' => $deliveredOrders,
                'cancelled' => $cancelledOrders,
            ],
            'revenue' => [
                'total' => $totalRevenue,
                'today' => $todayRevenue,
                'month' => $monthlyRevenue,
            ],
            'products' => [
                'total' => $totalProducts,
                'topSelling' => $topSelling,
            ],
            'customers' => [
                'total' => $totalCustomers,
                'newThisMonth' => $newCustomersThisMonth,
            ],
            'samples' => $samples,
            'labels' => $labels,
            'chartData' => $chartData,
            'coupons' => $activeCoupons,
            'carts' => $activeCarts,
        ]);
    }

    protected function get_model($samples, $labels) {
        $classifier = new KNearestNeighbors();

        if (file_exists(storage_path('app/ml_model.phpml'))) {
            $dateTimeOfPrevModel = date('Y-m-d H:i:s', filemtime(storage_path('app/ml_model.phpml')));
            if (now()->diffInDays($dateTimeOfPrevModel) < 7) {
                return unserialize(file_get_contents(storage_path('app/ml_model.phpml')));
            }
            $classifier = unserialize(file_get_contents(storage_path('app/ml_model.phpml')));
        }
        $classifier->train($samples, $labels);
        file_put_contents(storage_path('app/ml_model.phpml'), serialize($classifier));
        return $classifier;
    }
}
