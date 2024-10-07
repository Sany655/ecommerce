import useCart from "@/Hooks/useCart"
import PrimaryButton from "./PrimaryButton"
import { Link, router } from "@inertiajs/react"
import { useEffect, useState } from "react"

function ProductCart({ product }) {
    const { cart, addToCart, removeFromCart } = useCart()
    const [loading, setLoading] = useState(false)
    const cartItem = cart.find(item => item.product_id === product.id);

    return (
        <div className="flex flex-col rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={`/storage/${JSON.parse(product.images)[0]}`} alt={product.name} className="w-full rounded-t-lg h-full" />
            <div className="flex flex-col justify-between p-4 rounded-b-lg bg-gray-100">
                <h1 className="text-2xl font-bold mb-2 tracking-wide line-clamp-2">
                    {product.name}
                </h1>
                {loading ? (
                    <i className="fa fa-spinner text-2xl self-center mb-3 animate-spin"></i>
                ) : (
                    <i
                        className={`fa fa-heart ${cartItem?.id ? 'text-red-500' : 'text-blue-500 hover:text-gray-500'} text-2xl self-center mb-3 transition-colors cursor-pointer`}
                        onClick={() => {
                            setLoading(true);
                            addToCart(product).then(() => setLoading(false));
                        }}
                    ></i>
                )}
                <div className="flex gap-3 justify-center">
                    <PrimaryButton
                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                        onClick={() => addToCart(product).then(() => router.visit(route('home.checkout'))).catch(error => alert('Something went wrong, try again!'))}
                    >
                        Order Now
                    </PrimaryButton>
                    <Link href={route('home.product', product.id)}>
                        <PrimaryButton className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                            View Details
                        </PrimaryButton>
                    </Link>
                </div>
            </div>
        </div>

    )
}
export default ProductCart
