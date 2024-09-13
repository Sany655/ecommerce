import useCart from "@/Hooks/useCart"
import PrimaryButton from "./PrimaryButton"
import { Link } from "@inertiajs/react"
import { useEffect, useState } from "react"

function ProductCart({ product }) {
    const { cart, addToCart, removeFromCart } = useCart()
    const [isInCart, setIsInCart] = useState({})
    useEffect(() => {
        setIsInCart(cart.find(item => item.product_id === product.id) || {})
    }, [cart.length]);
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
                <i className={`fa fa-heart ${isInCart.id ? 'text-red-500' : 'text-yellow-500 hover:text-orange-500'} text-2xl self-center mb-3 transition-colors`} onClick={() => addToCart(product)}></i>
                <p className="text-white">{isInCart.quantity}</p>
                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                    <PrimaryButton className="bg-orange-500 hover:bg-orange-600">
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
