<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 768px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        h2,
        h3 {
            margin: 0 0 10px;
        }

        p {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }

        th {
            background-color: #f9f9f9;
            font-weight: bold;
        }

        .total-row {
            font-weight: bold;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #0056b3;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .summary-row strong {
            font-weight: bold;
        }
    </style>
</head>

<body class="bg-white">

    <div class="container">

        <h2 class="text-2xl font-bold text-center mb-8">Hamdaanz Order Invoice</h2>

        {{-- User Info --}}
        <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-2">Customer Info</h3>
            <p><strong>Name:</strong> {{ $order['name'] }}</p>
            <p><strong>Email:</strong> {{ $order['email'] }}</p>
            <p><strong>Address:</strong> {{ $order['address'] }}, {{ $order['division'] }}</p>
        </div>

        {{-- Product Info --}}
        <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-2">Order Details</h3>
            <table>
                <thead>
                    <tr class="border-b text-sm font-semibold text-gray-700">
                        <th class="py-2">Product</th>
                        <th class="py-2">Quantity</th>
                        <th class="py-2">Price</th>
                        <th class="py-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->orderItems as $item)
                        <tr class="border-b text-sm">
                            <td class="py-2">{{ $item['product']['name'] }}</td>
                            <td class="py-2">{{ $item['quantity'] }}</td>
                            <td class="py-2">{{ $item['product']['discount_price'] ?? $item['product']['price'] }} BDT
                            </td>
                            <td class="py-2">
                                {{ number_format($item['quantity'] * ($item['product']['discount_price'] ?? $item['product']['price']), 2) }}
                                BDT</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- Payment Info --}}
        <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-2">Payment Summary</h3>

            <div class="summary-row">
                <p><strong>Subtotal:</strong></p>
                <p>{{ $order['total_price'] }} BDT</p>
            </div>

            @if ($order['coupon'])
                <div class="summary-row">
                    <p><strong>Coupon Discount:</strong></p>
                    <p>{{ $order['coupon']['value'] ?? '0' }} BDT</p>
                </div>
            @endif

            <div class="summary-row">
                <p><strong>Shipping Cost:</strong></p>
                <p>{{ $order['division'] === 'Chittagong' ? '100' : '150' }} BDT</p>
            </div>

            <div class="summary-row total-row">
                <p><strong>Total:</strong></p>
                <p>{{ number_format($order['total_price'] + ($order['division'] === 'Chittagong' ? 100 : 150), 2) }}
                    BDT</p>
            </div>
        </div>

        {{-- Order Info --}}
        <div class="pb-4">
            <h3 class="text-lg font-semibold mb-2">Order Info</h3>
            <div class="summary-row">
                <p><strong>Order Date:</strong></p>
                <p>{{ \Carbon\Carbon::parse($order['created_at'])->format('m/d/Y') }}</p>
            </div>
            <!--<div class="summary-row">-->
            <!--    <p><strong>Status:</strong></p>-->
            <!--    <p>{{ $order['status'] ?? 'Processing' }}</p>-->
            <!--</div>-->
        </div>
    </div>

</body>

</html>
