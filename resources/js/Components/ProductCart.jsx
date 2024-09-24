import useCart from "@/Hooks/useCart"
import PrimaryButton from "./PrimaryButton"
import { Link, router } from "@inertiajs/react"
import { useEffect, useState } from "react"

function ProductCart({ product }) {
    const { cart, addToCart, removeFromCart } = useCart()
    const [loading, setLoading] = useState(false)
    const cartItem = cart.find(item => item.product_id === product.id);

    return (
        <div
            className="relative bg-cover bg-center h-80 mb-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            style={{ backgroundImage: `url('/storage/${product.image}')` }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-100 rounded-lg"></div>

            {/* Product Details */}
            <div className="relative flex flex-col justify-end h-full text-white p-6 rounded-lg">
                {/* Product Name */}
                <h1 className="text-3xl font-extrabold mb-2 text-white tracking-wider text-wrap line-clamp-2">{product.name}</h1>

                {/* Product Description */}
                <p className="text-sm mb-4 text-gray-300 line-clamp-2 text-wrap">{product.description}</p>

                {/* Heart Icon */}
                {loading ? <i className="fa fa-spinner text-2xl self-center mb-3 transition-colors"></i> : <i className={`fa fa-heart ${cartItem?.id ? 'text-red-500' : 'text-blue-500 hover:text-gray-500'} text-2xl self-center mb-3 transition-colors cursor-pointer`} onClick={() => {
                    setLoading(true)
                    addToCart(product).then(() => setLoading(false))
                }}></i>}
                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                    <PrimaryButton className="bg-yellow-600 hover:bg-yellow-900" onClick={() => addToCart(product).then(() => router.visit(route('home.checkout'))).catch(error => alert("something went wrong, try again!"))}>
                        Order Now
                    </PrimaryButton>
                    <Link href={route("home.product", product.id)}><PrimaryButton className="">
                        View Details
                    </PrimaryButton></Link>
                </div>
            </div>
        </div>
    )
}
export default ProductCart
