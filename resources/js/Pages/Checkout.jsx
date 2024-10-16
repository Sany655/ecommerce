import useCart from "@/Hooks/useCart";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Index() {
    const { props } = usePage() ?? {}; // Null check on usePage
    const { cart, removeFromCart, apply_coupon } = useCart() ?? {}; // Null check on useCart
    const { post, data, reset, setData, errors, clearErrors } = useForm({
        name: "",
        email: "",
        address: "",
        division: "",
        mobile: "",
        notes: "",
        shipping_cost: 0,
    }) ?? {}; // Null check on useForm

    const [shipCost, setShipCost] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    useEffect(() => {
        switch (data?.division) {
            case "Chittagong":
                setShipCost(100);
                setData("shipping_cost", 100);
                break;
            case "":
                setShipCost(0);
                setData("shipping_cost", 0);
                break;
            default:
                setShipCost(150);
                setData("shipping_cost", 150);
                break;
        }
    }, [data?.division]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        post(route('home.place_order'), {
            onSuccess: () => {
                clearErrors();
                // reset();
            },
        });
    };

    const applying_coupon_code = useRef(null);
    const applyCoupon = async () => {
        setCouponError('');
        setCouponSuccess('');

        try {
            const response = await axios.post(route('home.apply_coupon'), {
                coupon_code: applying_coupon_code.current?.value ?? "", // Null check on coupon code
            });

            if (response?.status === 200) {
                setCouponSuccess(response.data?.message ?? ""); // Null check on response data
                apply_coupon(
                    response.data?.coupon_id ?? "", // Null check on coupon_id
                    response.data?.discount ?? 0, // Null check on discount
                    response.data?.coupon ?? "" // Null check on coupon
                );
            }
        } catch (error) {
            setCouponError(error?.response?.data?.message ?? 'An unexpected error occurred'); // Null check on error response
        }
    };

    return (
        <form className="container gap-4 mx-auto lg:flex" onSubmit={handlePlaceOrder}>
            {/* Billing Details */}
            <div className="p-8 mb-8 bg-white rounded-lg shadow-lg lg:flex-1">
                <h1 className="mb-6 text-2xl font-bold">Billing details</h1>
                {props?.error && <p className="mb-6 text-center text-red-500">{props.error}</p>}
                <div className="grid gap-6">
                    {/* Name */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Name / আপনার নাম *</label>
                        <input
                            type="text"
                            name="name"
                            value={data?.name ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors?.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email / আপনার ইমেইল</label>
                        <input
                            type="email"
                            name="email"
                            value={data?.email ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                        />
                        {errors?.email && <p className="text-red-500">{errors.email}</p>}
                    </div>

                    {/* Division */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Division / বিভাগ *</label>
                        <select
                            name="division"
                            value={data?.division ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
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
                        {errors?.division && <p className="text-red-500">{errors.division}</p>}
                    </div>

                    {/* Mobile */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Mobile Number *</label>
                        <input
                            type="number"
                            name="mobile"
                            value={data?.mobile ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors?.mobile && <p className="text-red-500">{errors.mobile}</p>}
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Full Address / বিস্তারিত ঠিকানা *</label>
                        <input
                            type="text"
                            name="address"
                            value={data?.address ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors?.address && <p className="text-red-500">{errors.address}</p>}
                    </div>

                    {/* Notes */}
                    <div className="col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Order notes (optional)</label>
                        <textarea
                            name="notes"
                            value={data?.notes ?? ""} // Null check on data
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                        ></textarea>
                        {errors?.notes && <p className="text-red-500">{errors.notes}</p>}
                    </div>
                </div>
                {errors?.orderItems && <div className="text-center text-red-500">{errors.orderItems}</div>}
            </div>

            {/* Order Summary */}
            <div className="p-8 mb-8 bg-white rounded-lg shadow-lg lg:w-1/3">
                <h2 className="mb-6 text-2xl font-bold">Your order</h2>
                <table className="w-full mb-6 table-auto border-collapse">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-4">Product</th>
                            <th className="p-4">Variants</th>
                            <th className="p-4">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart?.cart_items?.map((item, i) => (
                            <tr key={i} className="border-b">
                                <td className="p-4 flex items-start gap-2">
                                    <button
                                        onClick={() => removeFromCart?.(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &#10005;
                                    </button>
                                    <div>
                                        <span className="block font-medium">{item?.product?.name ?? "Unnamed product"}</span>
                                        <span className="block text-sm text-gray-500">x {item?.quantity ?? 1}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    {
                                        item?.variants && Array.isArray(JSON.parse(item.variants)) &&
                                        JSON.parse(item.variants)?.map((v, i) => (
                                            v?.values && <span key={i} className="block">{v?.values}</span>
                                        ))
                                    }
                                </td>
                                <td className="p-4 text-red-500 font-semibold">
                                    &#2547;{item?.subtotal ?? 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex w-full mt-8">
                    <input
                        type="text"
                        placeholder="Coupon code"
                        className="flex-1 w-1/2 p-2 mr-2 border rounded"
                        ref={applying_coupon_code}
                    />
                    <button
                        type="button"
                        onClick={applyCoupon}
                        className="p-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
                    >
                        Apply Coupon
                    </button>
                </div>

                {couponError && <p className="mt-4 text-center text-red-500">{couponError}</p>}
                {couponSuccess && <p className="mt-4 text-center text-green-500">{couponSuccess}</p>}

                <div className="flex justify-between w-full mt-8">
                    <h3>Shipping cost:</h3>
                    <span>{shipCost}</span>
                </div>

                {
                    (cart.coupon || cart.cart_items.some(cI => cI.coupon)) && (
                        <div className="flex justify-between my-4">
                            <span className="font-semibold">Applied coupon</span>
                            {
                                cart.cart_items.some(cI => cI.coupon) && <span className="font-bold text-red-500">{cart.cart_items.reduce((sum, item) => sum + parseInt(item.coupon?.value || 0), 0)} &#2547;</span>
                            }
                            {
                                cart.coupon && <span className="font-bold text-red-500">{cart.coupon?.value} &#2547;</span>
                            }
                        </div>
                    )
                }

                <div className="flex justify-between w-full mt-8">
                    <h3>Total:</h3>
                    <span>{(parseInt(cart?.total_amount) + parseInt(shipCost)) || 0}</span>
                </div>

                <button type="submit" className="w-full p-2 mt-8 text-white bg-indigo-500 rounded hover:bg-indigo-700">
                    Place Order
                </button>
            </div>
        </form>
    );
}

function Checkout() {
    return (
        <AppLayout>
            <Head title='Checkout' />
            <Index />
        </AppLayout>
    )
}
export default Checkout;
