import useCart from "@/Hooks/useCart";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Index() {
    const { flash } = usePage().props;
    const { cart, removeFromCart, apply_coupon } = useCart() ?? {}; // Null check on useCart
    const { post, data, reset, setData, errors, clearErrors, processing } = useForm({
        name: "",
        email: "",
        address: "",
        division: "",
        mobile: "",
        notes: "",
        payment_method: "cash_on_delivery",
        payment_status: "pending",
        shipping_cost: 0,
    }) ?? {}; // Null check on useForm
    const params = new URLSearchParams(window.location.search)
    const [error, setError] = useState()
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    useEffect(() => {
        if (flash.error) setError(flash.error);
    }, [flash])
    

    useEffect(() => {
        const paymentID = params.get('paymentID');
        const status = params.get('status');
        if (paymentID) {
            switch (status) {
                case "cancel":
                    setError("The payment was cancelled.");
                    break;
                case "failure":
                    setError("The payment was failed.");
                    break;
                case "success":
                    setData("payment_status", "paid");
                    placeOrder();
                default:
                    break;
            }
        }
    }, [])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                window.history.replaceState(null, '', window.location.pathname);
                setError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // if (name === "division") {
        //     let shipcost = 0
        //     switch (value) {
        //         case "Chittagong":
        //             shipcost = 100;
        //             break;
        //         case "":
        //             shipcost = 0;
        //             break;
        //         default:
        //             shipcost = 150;
        //             break;
        //     }
        //     // setShipCost(shipcost);
        //     setData(prevData => ({ ...prevData, [name]: value, shipping_cost: shipcost }));
        // } else {
        // }
        setData(name, value);
    };

    const handlePlaceOrder = (e) => {
        setError('');
        e.preventDefault();
        if (data.payment_method === 'bkash') {
            olinePayment();
        } else {
            placeOrder();
        }
    };

    function olinePayment() {
        axios.post(route('home.online_payment'), { total_amount: parseInt(cart.total_amount) + parseInt(data.shipping_cost) }).then(response => {
            window.location.href = response.data.bkashURL;
        }).catch(error => {
            setError(error.response.data.message);
        })
    }

    function placeOrder() {
        fbq('track', 'Purchase', {
            value: cart.total_amount + parseInt(data.shipping_cost),
            currency: 'BDT',
            content_ids: cart.cart_items.map(p => p.product.id),
            content_type: 'product'
        })
        post(route('home.place_order'), {
            onSuccess: () => {
                clearErrors();
                // reset();
            },
        });
    }

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
            <div className="p-4 md:p-8 mb-8 bg-white rounded-lg shadow-lg lg:flex-grow">
                <h1 className="mb-6 text-2xl font-bold">Billing details</h1>
                {error && <p className="mb-6 text-center text-red-500 text-wrap">{error}</p>}
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
            <div className="p-4 md:p-8 mb-8 bg-white rounded-lg shadow-lg lg:w-1/3">
                <h2 className="mb-6 text-2xl font-bold">Your order</h2>

                {/* Order Items */}
                <div className="space-y-4">
                    {cart?.cart_items?.map((item, i) => (
                        <div key={i} className="p-4 border rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-2">
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart?.(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &#10005;
                                    </button>
                                    <div>
                                        <span className="block font-medium">{item?.product?.name ?? "Unnamed product"}</span>
                                        <span className="block text-sm text-gray-500">x {item?.quantity ?? 1}</span>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold">
                                    {item?.subtotal ?? 0} BDT
                                </div>
                            </div>

                            {/* Variants */}
                            {item?.variants && Array.isArray(JSON.parse(item.variants)) && (
                                <div className="mt-2 text-sm text-gray-700">
                                    {JSON.parse(item.variants)?.map((v, i) => (
                                        v?.values && <span key={i} className="block">{v?.values}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Coupon Input */}
                <div className="flex mt-8">
                    <input
                        type="text"
                        placeholder="Coupon code"
                        className="flex-1 p-2 mr-2 border rounded"
                        ref={applying_coupon_code}
                    />
                    <button
                        type="button"
                        onClick={applyCoupon}
                        className="p-2 text-white bg-indigo-500 rounded hover:bg-indigo-700 text-sm"
                    >
                        Apply Coupon
                    </button>
                </div>

                {/* Coupon Feedback */}
                {couponError && <p className="mt-4 text-center text-red-500">{couponError}</p>}
                {couponSuccess && <p className="mt-4 text-center text-green-500">{couponSuccess}</p>}

                {/* Shipping Cost */}
                <div className="flex justify-between w-full mt-8">
                    <h3>Shipping cost:</h3>
                    <span>{data.shipping_cost} BDT</span>
                </div>

                {/* Applied Coupon */}
                {(cart.coupon || cart.cart_items.some(cI => cI.coupon)) && (
                    <div className="flex justify-between my-4">
                        <span className="font-semibold">Applied coupon</span>
                        <span className="font-bold text-red-500">
                            {cart.cart_items.some(cI => cI.coupon) ? (
                                cart.cart_items.reduce((sum, item) => sum + parseInt(item.coupon?.value || 0), 0)
                            ) : cart.coupon?.value} BDT
                        </span>
                    </div>
                )}

                {/* Payment Method */}
                <div className="">
                    <h3 className="text-xl font-bold">Payment method:</h3>
                    <div>
                        <input
                            type="radio"
                            id="cash_on_delivery"
                            name="payment_method"
                            value="cash_on_delivery"
                            checked={data?.payment_method === 'cash_on_delivery'}
                            onChange={e => setData("payment_method", e.target.value)}
                        />
                        <label htmlFor="cash_on_delivery" className="ml-2">Cash on Delivery</label>
                        <br />
                        {/* <input
                            type="radio"
                            id="bkash"
                            name="payment_method"
                            value="bkash"
                            checked={data?.payment_method === 'bkash'}
                            onChange={e => setData("payment_method", e.target.value)}
                        />
                        <label htmlFor="bkash" className="ml-2">Bkash</label> */}
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between w-full mt-8">
                    <h3>Total:</h3>
                    <span>{(parseInt(cart?.total_amount) + parseInt(data.shipping_cost)) || 0} BDT</span>
                </div>

                {/* Place Order Button */}
                <button type="submit" className="w-full p-2 mt-8 text-white bg-indigo-500 rounded hover:bg-indigo-700">
                    {processing ? <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i> : "Place Order"}
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
