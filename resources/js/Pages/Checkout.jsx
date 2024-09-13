import useCart from "@/Hooks/useCart";
import AppLayout from "@/Layouts/AppLayout"
import { Head, router, useForm, usePage } from "@inertiajs/react"
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Index() {
    const { cart, clearCart } = useCart();
    const { post, data, reset, setData, errors, clearErrors } = useForm({
        name: "",
        email: "",
        address: "",
        division: "",
        mobile: "",
        notes: "",
    });
    const [success, setSuccess] = useState('')
    const subtotal = cart.reduce((total, item) => Math.round(total + (item.product?.discount_price || item.product?.price) * item.quantity), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // setData(prev => ({ ...prev, orderItems: oI }));
        post(route('home.place_order'), {
            onSuccess: () => {
                clearErrors();
                clearCart();
                setSuccess('Order placed successfully!');
                reset();
            }
        });
    };


    return (
        <form className="container mx-auto md:flex gap-4" onSubmit={handlePlaceOrder}>
            {/* Billing Details */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 md:flex-1">
                <h1 className="text-2xl font-bold mb-6">Billing details</h1>
                <div className="grid gap-6">
                    {/* Name */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name / আপনার নাম *</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email / আপনার ইমেইল</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Division / বিভাগ *</label>
                        <select
                            name="division"
                            value={data.division}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                            required
                        >
                            <option value="">Select a Division</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Barisal">Barisal</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Mymensingh">Mymensingh</option>
                        </select>
                        {errors.division && <p className="text-red-500">{errors.division}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                        <input
                            type="text"
                            name="mobile"
                            value={data.mobile}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />
                        {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address / বিস্তারিত ঠিকানা *</label>
                        <input
                            type="text"
                            name="address"
                            value={data.address}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                            required
                        />
                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                    </div>

                    {/* Order Notes */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order notes (optional)</label>
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleInputChange}
                            className="border rounded-lg w-full p-2"
                            rows={3}
                        ></textarea>
                        {errors.notes && <p className="text-red-500">{errors.notes}</p>}
                    </div>
                </div>
                {success && <div className="text-green-500 text-center">{success}</div>}
                {errors.orderItems && <div className="text-red-500 text-center">{errors.orderItems}</div>}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Your order</h2>
                <table className="w-full table-auto mb-6">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">Product</th>
                            <th className="text-left p-4">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, i) => (
                            <tr key={i} className="border-b">
                                <td className="p-4 line-clamp-1">
                                    {item.product.name} × {item.quantity}
                                </td>
                                <td className="p-4 text-red-500">&#2547; {Math.round((item.product.discount_price || item.product.price) * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-red-500 font-bold">&#2547; {subtotal}</span>
                </div>
                {/* <div className="flex justify-between mb-4">
                    <span className="font-semibold">Shipping</span>
                    <span>Enter your address to view shipping options.</span>
                </div> */}
                {/* <div className="flex justify-between mb-4">
                    <span className="font-semibold">Vat</span>
                    <span>10%</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">GST</span>
                    <span>2%</span>
                </div> */}
                <div className="flex justify-between mb-6">
                    <span className="font-semibold">Total</span>
                    <span className="text-red-500 font-bold">&#2547; {subtotal}</span>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Cash on delivery</h3>
                    <p className="text-sm text-gray-600">Pay with cash upon delivery.</p>
                </div>

                {/* Place Order Button */}
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg w-full hover:bg-orange-600 disabled:opacity-50"
                    disabled={cart.length === 0 || data.name === "" || data.address === "" || data.division === "" || data.mobile === ""}
                >
                    Place order
                </button>
            </div>
        </form>
    );
}

function Checkout() {
    return (
        <AppLayout>
            <Head title="Checkout" />
            <Index />
        </AppLayout>
    )
}
export default Checkout
