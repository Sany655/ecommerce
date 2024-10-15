<x-mail::message>
<div style="text-align: center; margin-bottom: 20px;">
    <img src="{{ asset('images/logo.png') }}" alt="App Logo" style="width: 150px;">
</div>
# Order Invoice

Thank you for your order, {{ $order->name }}! Here are the details of your purchase:

## Customer Info
- **Name:** {{ $order->name }}
- **Email:** {{ $order->email }}
- **Address:** {{ $order->address }}, {{ $order->city }}, {{ $order->division }}

## Order Details
<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Product</th>
            <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Quantity</th>
            <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Price</th>
            <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($order->orderItems as $item)
            <tr>
                <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ $item->product->name }}</td>
                <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ $item->quantity }}</td>
                <td style="border-bottom: 1px solid #eee; padding: 8px;">
                    {{ $item->product->discount_price ?? $item->product->price }} BDT</td>
                <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ $item->subtotal }} BDT</td>
            </tr>
        @endforeach
    </tbody>
</table>

## Payment Summary
- **Subtotal:** {{ $order->total_price }} BDT

@php
    $hasCoupon = $order->coupon || $order->orderItems->contains(fn($item) => $item->coupon);
@endphp

@if ($hasCoupon)
    - **Coupon:** {{ $order->coupon->value ?? '0' }} BDT
@endif

- **Shipping Cost:** {{ $order->division === 'Chittagong' ? '100' : '150' }} BDT
- **Total:** {{ $order->total_price + ($order->division === 'Chittagong' ? 100 : 150) }} BDT

## Order Info
- **Order Date:** {{ \Carbon\Carbon::parse($order->created_at)->toFormattedDateString() }}
- **Status:** {{ $order->status ?? 'Processing' }}

<x-mail::button :url="route('home.download_invoice', ['orderId' => $order->id])">
    Download Invoice
</x-mail::button>

Thank you for shopping with us!<br>
{{ config('app.name') }}
</x-mail::message>
