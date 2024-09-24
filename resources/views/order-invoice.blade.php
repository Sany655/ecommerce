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
    </style>
</head>

<body class="bg-white">

    <div class="container">
        <h2 class="text-2xl font-bold text-center mb-8">Order Invoice</h2>

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
                        <th class="py-2">Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->orderItems as $item)
                        <tr class="border-b text-sm">
                            <td class="py-2">{{ $item['product']['name'] }}</td>
                            <td class="py-2">{{ $item['quantity'] }}</td>
                            <td class="py-2">{{ $item['product']['price'] || $item['product']['discount_price'] }}
                            </td>
                            <td class="py-2">{{ number_format($item['quantity'] * $item['product']['price'], 2) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- Payment Info --}}
        <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-2">Payment Summary</h3>
            <div class="flex justify-between text-sm">
                <p><strong>Subtotal:</strong></p>
                <p>{{ $order['total_price'] }}</p>
            </div>
            <div class="flex justify-between text-sm">
                <p><strong>Tax (5%):</strong></p>
                <p>{{ number_format($order['total_price'] * 0.05, 2) }}</p>
            </div>
            <div class="flex justify-between text-sm total-row">
                <p><strong>Total:</strong></p>
                <p>{{ number_format($order['total_price'] * 1.05, 2) }}</p>
            </div>
        </div>

        {{-- Order Info --}}
        <div class="pb-4">
            <h3 class="text-lg font-semibold mb-2">Order Info</h3>
            <div class="flex justify-between text-sm">
                <p><strong>Order Date:</strong></p>
                <p>{{ \Carbon\Carbon::parse($order['created_at'])->format('m/d/Y') }}</p>
            </div>
        </div>
    </div>

</body>

</html>
