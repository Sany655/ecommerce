import AppLayout from "@/Layouts/AppLayout"
import { Head, Link } from "@inertiajs/react"
import useCart from "@/Hooks/useCart"
import { useState } from "react"

const Index = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useCart()
    const subtotal = cart.reduce((total, item) => Math.round(total + (item.product?.discount_price || item.product?.price) * item.quantity), 0);


    return (
        <div className="container mx-auto flex flex-col lg:flex-row gap-2">
            {/* Cart Table */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex-1">
                <h1 className="text-2xl font-bold mb-6">Cart</h1>
                {
                    cart.length > 0 ? (
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4"> </th>
                                    <th className="text-left p-4">Product</th>
                                    <th className="text-left p-4">Price</th>
                                    <th className="text-left p-4">Discount Price</th>
                                    <th className="text-left p-4">Quantity</th>
                                    <th className="text-left p-4">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, i) => (
                                    <tr key={i} className="">
                                        <td className="p-4">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                                &#10005;
                                            </button>
                                        </td>
                                        <td className="p-4 flex items-center">
                                            <img src={`/storage/${item.product?.image}`} alt={item.product?.name} className="w-16 h-16 rounded-lg mr-4" />
                                            <Link className="text-orange-500 hover:underline line-clamp-1" href={route('home.product', item.product_id)}>{item.product?.name}</Link>
                                        </td>
                                        <td className="p-4 text-red-500">&#2547; {Math.round(item.product?.price)}</td>
                                        <td className="p-4 text-red-500">&#2547; {Math.round(item.product?.discount_price)}</td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                className="border rounded-lg w-16 text-center"
                                                onChange={(e) => addToCart(item.product, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-4 text-red-500">&#2547; {Math.round(parseFloat(item.product?.discount_price || item.product?.price) * parseInt(item.quantity))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="py-8 text-center">No product available in your cart!</p>
                    )
                }
            </div>

            {/* Cart Totals */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Cart totals</h2>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-red-500 font-bold">&#2547; {subtotal}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Shipping</span>
                    <span>Shipping costs are calculated during checkout.</span>
                </div>
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
                {cart.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <Link href={route('home.checkout')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 mt-4 text-center">
                            Proceed to checkout
                        </Link>
                        <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600" onClick={() => {
                            if (window.confirm('Are you sure you want to clear your cart?') && window.confirm('This action cannot be undone.')) {
                                clearCart()
                            }
                        }}>Clear Cart</button>
                    </div>
                )}
            </div>
        </div >
    )
}

function CartPage() {
    return (
        <AppLayout>
            <Head title='Cart' />
            <Index />
        </AppLayout>
    )
}

export default CartPage
