import useCart from "@/Hooks/useCart";
import PrimaryButton from "./PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

function ProductCard({ product }) {
    const { cart, addToCart, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const cartItem = cart.cart_items?.find(item => item.product_id === product.id);

    // Null check for product and images
    const productImages = product?.images ? JSON.parse(product.images) : null;
    const productVariants = product?.variants ? JSON.parse(product.variants) : null;

    return (
        <div className="flex flex-col transition-transform transform rounded-lg shadow-lg hover:scale-105 hover:shadow-xl">
            <img src={`/storage/${productImages ? productImages[0] : null}`} alt={product?.name} className="w-full h-full rounded-t-lg" />
            <div className="flex flex-col justify-between p-4 bg-gray-100 rounded-b-lg">
                <h1 className="mb-2 text-sm font-bold tracking-wide text-center line-clamp-5">
                    {product?.name}
                </h1>

                {/* Handle cart button or spinner */}
                {(product.variants && Array.isArray(JSON.parse(product.variants)) && JSON.parse(product.variants).some(v => v.values.split(',').length > 1))
                    ? null : (
                        loading ? (
                            <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i>
                        ) : (
                            <i
                                className={`fa-heart text-blue-500 hover:text-gray-500 text-2xl self-center mb-3 transition-colors cursor-pointer ${cartItem?.id ? 'fa-solid' : 'fa-regular'}`}
                                onClick={() => {
                                    setLoading(true);
                                    addToCart(product, null, productVariants).then(() => setLoading(false));
                                }}
                            ></i>
                        )
                    )}

                <div className="flex justify-center gap-3">
                    {/* Handle the Order Now button */}
                    {(product.variants && Array.isArray(JSON.parse(product.variants)) && JSON.parse(product.variants).some(v => v.values.split(',').length > 1))
                        ? null : (
                            <PrimaryButton
                                className="px-4 py-2 text-white transition-colors bg-yellow-600 rounded-lg hover:bg-yellow-700"
                                onClick={() => cartItem?.id ? router.visit(route('home.checkout')) : addToCart(product).then(() => router.visit(route('home.checkout'))).catch(error => alert('Something went wrong, try again!'))}
                            >
                                Order Now
                            </PrimaryButton>
                        )}
                    {/* View Details button */}
                    <Link href={route('home.product', product?.id)}>
                        <PrimaryButton className="px-4 py-2 text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600">
                            View Details
                        </PrimaryButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
