import AppLayout from "@/Layouts/AppLayout"
import { Head, Link } from "@inertiajs/react"
import useCart from "@/Hooks/useCart"

const Index = () => {
    const { cart, removeFromCart, addToCart, clearCart, cartLoading } = useCart()

    return (
        <div className="container flex flex-col gap-2 mx-auto lg:flex-row">
            {/* Cart Table */}
            <div className="flex-1 p-4 md:p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center md:text-left">Cart</h1>
                {cart.cart_items?.length > 0 ? (
                    <div className="space-y-4">
                        {cart.cart_items?.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg"
                            >
                                {/* Image Section */}
                                <div className="w-full md:w-24 flex-shrink-0">
                                    <img
                                        src={item.product?.images ? `/storage/${JSON.parse(item.product.images)[0]}` : ''}
                                        alt={item.product?.name}
                                        className="w-full md:w-24 h-24 object-contain md:object-cover rounded-lg"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <Link
                                        className="text-blue-500 hover:underline"
                                        href={route('home.product', item.product_id)}
                                    >
                                        {item.product?.name || 'No name available'}
                                    </Link>

                                    {/* Price */}
                                    <div className="mt-2 text-red-500 font-bold">
                                        Price: {Math.round(item.product?.discount_price || item.product?.price) || 0.00} BDT
                                    </div>

                                    {/* Variants */}
                                    <div className="text-sm text-gray-600">
                                        {item.variants ? (
                                            Array.isArray(JSON.parse(item.variants)) ? (
                                                JSON.parse(item.variants).map((variant, j) => (
                                                    <span key={j}>
                                                        {variant.attribute} : {variant.values},{' '}
                                                    </span>
                                                ))
                                            ) : (
                                                'Invalid variant data'
                                            )
                                        ) : (
                                            'No variants available'
                                        )}
                                    </div>
                                </div>

                                {/* Quantity and Subtotal */}
                                <div className="flex items-center space-x-4">
                                    <div>
                                        {cartLoading ? (
                                            <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i>
                                        ) : (
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                className="w-16 text-center border rounded-lg"
                                                onChange={(e) =>
                                                    e.target.value > 0 && addToCart(item.product.id, parseInt(e.target.value), item.variants)
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-red-500 font-bold">
                                        Subtotal: {Math.round(parseFloat(item.subtotal))} BDT
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center">No product available in your cart!</p>
                )}
            </div>



            {/* Cart Totals */}
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold">Cart totals</h2>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-red-500">{cart.cart_items?.reduce((sum, item) => sum + parseInt(item.subtotal), 0)} BDT</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Shipping</span>
                    <span>Shipping costs are calculated during checkout.</span>
                </div>
                {
                    (cart.coupon || cart.cart_items.some(cI => cI.coupon)) && (
                        <div className="flex justify-between my-4">
                            <span className="font-semibold">Applied coupon</span>
                            {
                                cart.cart_items.some(cI => cI.coupon) && <span className="font-bold text-red-500">{cart.cart_items.reduce((sum, item) => sum + parseInt(item.coupon?.value || 0), 0)} BDT</span>
                            }
                            {
                                cart.coupon && <span className="font-bold text-red-500">{cart.coupon?.value} BDT</span>
                            }
                        </div>
                    )
                }
                <div className="flex justify-between mb-6">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-red-500">{cart.total_amount} BDT</span>
                </div>
                {cart.cart_items?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <Link href={route('home.checkout')} onClick={() => fbq('track', 'InitiateCheckout', {
                            value: cart.total_amount,
                            currency: 'BDT'
                        })} className="px-6 py-3 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600">
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
