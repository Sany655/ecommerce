import useCart from "@/Hooks/useCart";
import PrimaryButton from "./PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

function ProductCard({ product }) {
    const { cart, addToCart, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [productVariants, setProductVariants] = useState([])
    const [cartItem, setCartItem] = useState({});

    // Null check for product and images

    useEffect(() => {
        setProductVariants(product?.variants ? JSON.parse(product.variants) : [])
    }, [product])

    useEffect(() => {
        setCartItem(cart.cart_items?.find(item => item.product_id === product.id) || {});
    }, [cart, product.id]);

    return (
        <div className="flex flex-col justify-between transition-transform transform rounded-lg shadow-lg hover:scale-105 hover:shadow-xl">
            <img src={(product.images && JSON.parse(product.images).length > 0) ? `/storage/${JSON.parse(product.images)[0]}` : '/images/default-product.png'} alt={product?.name} className="w-full rounded-t-lg" />
            <div className="flex flex-col justify-between p-4 bg-gray-100 rounded-b-lg">
                <h1 className="mb-2 text-sm font-bold tracking-wide text-center line-clamp-5">
                    {product?.name}
                </h1>

                <p className="text-gray-600 text-center flex flex-col mb-2">{product.discount_price ? (
                    <>
                        <span className="px-1">Regular Price: <span className="line-through">{product.price} BDT</span></span>
                        <span>Discount Price: {product.discount_price} BDT</span>
                    </>
                ) : <span className="px-1">Regular Price: {product.price} BDT</span>}</p>

                {/* Handle cart button or spinner */}
                {(productVariants.some(v => v.values?.split(',').length > 1))
                    ? null : (
                        loading ? (
                            <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i>
                        ) : (
                            <i
                                className={`fa-heart text-blue-500 hover:text-gray-500 text-2xl self-center mb-3 transition-colors cursor-pointer ${Object.keys(cartItem).length > 0 ? 'fa-solid' : 'fa-regular'}`}
                                onClick={() => {
                                    setLoading(true);
                                    if (Object.keys(cartItem).length > 0) {
                                        removeFromCart(cartItem.id).then(() => setLoading(false));
                                    } else {
                                        addToCart(product.id, 1, product.variants).then(() => setLoading(false));
                                    }
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
                                onClick={() => cartItem?.id ? router.visit(route('home.checkout')) : addToCart(product.id, 1, product.variants).then(() => router.visit(route('home.checkout'))).catch(error => alert('Something went wrong, try again!'))}
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
