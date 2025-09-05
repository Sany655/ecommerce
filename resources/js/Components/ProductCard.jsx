
import useCart from "@/Hooks/useCart";
import PrimaryButton from "./PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

function ProductCard({ product }) {
    const { cart, addToCart, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const [selectedVariants, setSelectedVariants] = useState([])

    useEffect(() => {
        if (cart.cart_items?.length > 0) {
            const matchingCartItem = cart.cart_items.find((item) => {
                if (item.product?.id !== product.id) return false;

                if (!item.variants || item.variants === '[]') {
                    // No variants exist in the item, just match by product ID
                    return true;
                }

                if (selectedVariants?.length > 0) {
                    const itemVariants = JSON.parse(item.variants);
                    const isMatch = itemVariants.every((itemVariant, index) => {
                        return (
                            itemVariant.attribute === selectedVariants[index]?.attribute &&
                            itemVariant.values === selectedVariants[index]?.values
                        );
                    });
                    return isMatch;
                }

                return false;
            }) || {};

            setCartItem(matchingCartItem);
        } else {
            setCartItem({});
        }
    }, [selectedVariants, cart, product.id]);



    useEffect(() => {
        if (product.variants?.length > 0) {
            const initialVariants = JSON.parse(product.variants).map((variant) => {
                return ({
                    attribute: variant.attribute,
                    values: variant.values.split(',')[0],
                })
            });
            setSelectedVariants(initialVariants);
        }
    }, [product.variants]);

    const handleVariantClick = (attribute, value) => {
        setSelectedVariants((prevState) => {
            const updatedVariants = prevState.map((variant) => {
                if (variant.attribute === attribute) {
                    return { ...variant, values: value };
                }
                return variant;
            });
            return updatedVariants;
        });
    };

    return (
        <div className="flex flex-col justify-between transition-transform transform rounded-lg shadow-lg hover:scale-105 hover:shadow-xl">
            <Link href={route('home.product', product?.id)}>
                <img src={(product.images && JSON.parse(product.images).length > 0) ? `/storage/${JSON.parse(product.images)[0]}` : '/images/default-product.png'} alt={product?.name} className="w-full rounded-t-lg" />
            </Link>
            <div className="flex flex-col justify-between p-4 bg-gray-100 rounded-b-lg">
                <Link href={route('home.product', product?.id)}>
                    <h1 className="mb-2 text-md font-bold tracking-wide text-center line-clamp-5">
                        {product?.name}
                    </h1>
                </Link>

                <p className="text-gray-600 text-center flex flex-col mb-2 text-sm">{product.discount_price ? (
                    <>
                        <span className="px-1">Regular Price: <span className="line-through">{product.price} BDT</span></span>
                        <span>Discount Price: {product.discount_price} BDT</span>
                    </>
                ) : <span className="px-1">Regular Price: {product.price} BDT</span>}</p>

                <p className="text-gray-600 text-center flex flex-col mb-2">
                    {product.variants && JSON.parse(product.variants).length > 0 && (
                        <span className="px-1">
                            {JSON.parse(product.variants).map((v, k) => (
                                <span key={k} className="block text-xs">
                                    {v.attribute}:
                                    {v.values.split(",").map((val, i) => (
                                        <label
                                            key={i}
                                            htmlFor={`${product.id}-variant-${k}-${i}`}
                                            className="cursor-pointer mx-1"
                                        >
                                            <input
                                                onChange={() => handleVariantClick(v.attribute, val)}
                                                type="radio"
                                                id={`${product.id}-variant-${k}-${i}`}
                                                name={`${product.id}-variant-${k}`}
                                                value={val}
                                                className="mr-1"
                                                checked={selectedVariants.find(sv => sv.attribute === v.attribute)?.values === val}
                                            />
                                            {val}
                                        </label>
                                    ))}
                                </span>
                            ))}
                        </span>
                    )}
                </p>

                {/* Handle cart button or spinner */}
                {
                    loading ? (
                        <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i>
                    ) : (
                        <i
                            className={`fa-heart text-blue-500 hover:text-gray-500 text-2xl self-center mb-3 transition-colors cursor-pointer ${Object.keys(cartItem).length > 0 ? "fa-solid" : "fa-regular"}`}
                            onClick={() => {
                                setLoading(true);
                                if (Object.keys(cartItem).length > 0) {
                                    removeFromCart(cartItem.id).then(() => setLoading(false));
                                } else {
                                    if (selectedVariants.length < (product?.variants && JSON.parse(product.variants).length)) {
                                        alert(`Please select which ${product.variants ? JSON.parse(product.variants).map(v => v.attribute).join(", ") : ""} you want!`);
                                        setLoading(false);
                                        return;
                                    }
                                    // fbq('track', 'AddToCart', {
                                    //     content_name: product?.name,
                                    //     content_category: product?.category?.name,
                                    //     value: product.discount_price || product.price,
                                    //     currency: 'BDT'
                                    // });
                                    addToCart(product.id, 1, JSON.stringify(selectedVariants)).then(() => setLoading(false));
                                }
                            }}
                        ></i>
                    )
                }

                <div className="flex justify-center gap-3">
                    {/* Order Now button */}
                    {selectedVariants.some(v => v.values?.split(',').length > 1)
                        ? null
                        : (
                            <PrimaryButton
                                className="px-4 py-2 text-white transition-colors bg-yellow-600 rounded-lg hover:bg-yellow-700"
                                onClick={() => {
                                    if (cartItem?.id) {
                                        router.visit(route('home.checkout'));
                                    } else {
                                        setLoading(true);
                                        if (selectedVariants.length < (product?.variants ? JSON.parse(product.variants).length : 0)) {
                                            alert(`Please select which ${product.variants ? JSON.parse(product.variants).map(v => v.attribute).join(", ") : ""} you want!`);
                                            setLoading(false);
                                            return;
                                        }
                                        addToCart(product.id, 1, JSON.stringify(selectedVariants))
                                            .then(() => {
                                                // fbq('track', 'InitiateCheckout', {
                                                //     value: product.discount_price || product.price,
                                                //     currency: 'BDT'
                                                // })
                                                router.visit(route('home.checkout'))
                                            })
                                            .catch(() => alert('Something went wrong, try again!'))
                                            .finally(() => {
                                                setLoading(false)
                                            });
                                    }
                                }}
                            >
                                Order Now
                            </PrimaryButton>
                        )
                    }
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
