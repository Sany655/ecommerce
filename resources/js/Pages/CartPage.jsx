import AppLayout from "@/Layouts/AppLayout"
import { Head, Link } from "@inertiajs/react"
import useCart from "@/Hooks/useCart"

const Index = () => {
    const { cart, removeFromCart, addToCart, clearCart, cartLoading } = useCart()
    
    return (
        <div className="container flex flex-col gap-2 mx-auto lg:flex-row">
            {/* Cart Table */}
            <div className="flex-1 p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold">Cart</h1>
                {
                    cart.cart_items?.length > 0 ? (
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 text-left"> </th>
                                    <th className="p-4 text-left">Product</th>
                                    <th className="p-4 text-left">Price</th>
                                    <th className="p-4 text-left">Quantity</th>
                                    <th className="p-4 text-left">Variant</th>
                                    <th className="p-4 text-left">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cart.cart_items?.map((item, i) => (
                                        <tr key={i} className="">
                                            <td className="p-4">
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                                    &#10005;
                                                </button>
                                            </td>
                                            <td className="flex items-center p-4">
                                                {/* Null check for item.product?.images */}
                                                <img src={item.product?.images ? `/storage/${JSON.parse(item.product.images)[0]}` : ''} alt={item.product?.name} className="w-16 h-16 mr-4 rounded-lg" />
                                                <Link className="text-blue-500 hover:underline line-clamp-1" href={route('home.product', item.product_id)}>
                                                    {item.product?.name || 'No name available'}
                                                </Link>
                                            </td>
                                            <td className="p-4 text-red-500">{Math.round(item.product?.discount_price || item.product?.price) || 0.00} &#2547;</td>
                                            <td className="p-4">
                                                {cartLoading ? <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i> : <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    className="w-16 text-center border rounded-lg"
                                                    onChange={(e) => e.target.value > 0 && addToCart(item.product.id, parseInt(e.target.value), item.variants)}
                                                />}
                                            </td>
                                            <td className="">
                                                {/* Null check for item.variants and ensure the parsed value is an array */}
                                                {item.variants ?
                                                    Array.isArray(JSON.parse(item.variants)) ?
                                                        JSON.parse(item.variants).map((variant, j) => (
                                                            variant.values && `${variant.attribute} : ${variant.values}, `
                                                        ))
                                                        : Array.isArray(item.variants) ? item.variants.map((variant, j) => (
                                                            variant.values && `${variant.attribute} : ${variant.values}, `
                                                        )) : 'Invalid variant data'
                                                    : 'No variants available'}
                                            </td>
                                            <td className="p-4 text-red-500">
                                                {Math.round(parseFloat(item.subtotal))} &#2547;
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <p className="py-8 text-center">No product available in your cart!</p>
                    )
                }
            </div>

            {/* Cart Totals */}
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold">Cart totals</h2>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-red-500">{cart.cart_items?.reduce((sum, item) => sum + parseInt(item.subtotal), 0)} &#2547;</span>
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
                <div className="flex justify-between mb-6">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-red-500">{cart.total_amount} &#2547;</span>
                </div>
                {cart.cart_items?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <Link href={route('home.checkout')} className="px-6 py-3 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                            Proceed to checkout
                        </Link>
                        <button className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600" onClick={() => {
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
