import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import useCart from "@/Hooks/useCart"
import ProductCart from "@/Components/ProductCard";
import axios from "axios";
import DOMPurify from "dompurify";

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images && images[0]);
    const [zoomStyle, setZoomStyle] = useState({});
    const imageRef = useRef(null);

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const { offsetWidth, offsetHeight } = e.target;

        const xPercent = (offsetX / offsetWidth) * 100;
        const yPercent = (offsetY / offsetHeight) * 100;

        setZoomStyle({
            transformOrigin: `${xPercent}% ${yPercent}%`,
            transform: 'scale(2)',
        });
    };

    const resetZoom = () => {
        setZoomStyle({});
    };


    const openFullscreen = () => {
        if (imageRef.current) {
            if (imageRef.current.requestFullscreen) {
                imageRef.current.requestFullscreen();
            } else if (imageRef.current.webkitRequestFullscreen) {
                imageRef.current.webkitRequestFullscreen(); // Safari
            } else if (imageRef.current.msRequestFullscreen) {
                imageRef.current.msRequestFullscreen(); // IE/Edge
            }
        }
    };

    return (
        <div className="">
            <div className="relative w-full p-4 overflow-hidden">
                <img
                    ref={imageRef}
                    src={'/storage/' + selectedImage}
                    alt="Product Image"
                    className="object-cover w-full h-full"
                    style={zoomStyle}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={resetZoom}
                />
                <button
                    onClick={openFullscreen}
                    className="absolute w-10 h-10 text-blue-500 bg-white rounded-full top-2 right-2"
                >
                    <i className="fa fa-magnifying-glass"></i>
                </button>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
                {images && images.map((image, index) => (
                    <div key={index} className="cursor-pointer">
                        <img
                            src={'/storage/' + image}
                            alt={`Thumbnail ${index}`}
                            className={`w-24 h-24 object-cover ${selectedImage === image && 'border border-2 border-blue-500'}`}
                            onClick={() => setSelectedImage(image)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Index = ({ product }) => {
    const { cart, addToCart, removeFromCart, cartLoading } = useCart()
    const { name, short_description, description, variants, price, images, discount_price, status } = product;
    const sanitizedDescription = DOMPurify.sanitize(description);
    const sanitizedshort_description = DOMPurify.sanitize(short_description);
    const [selectedVariants, setSelectedVariants] = useState([])
    const [cartItem, setCartItem] = useState({});

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
        if (variants?.length > 0) {
            const initialVariants = JSON.parse(variants).map((variant) => {
                return ({
                    attribute: variant.attribute,
                    values: variant.values.split(',')[0],
                })
            });
            setSelectedVariants(initialVariants);
        }
    }, [variants]);

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
        <div className="container p-4 md:p-8 mx-auto bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="w-full">
                    {
                        (images && JSON.parse(images).length > 0) ? <ImageGallery images={JSON.parse(images)} /> : (
                            <img
                                src={'/images/default-product.png'}
                                alt="Product Image"
                                className="object-cover w-full h-full"
                            />
                        )
                    }
                </div>

                {/* Product Information Section */}
                <div className="p-4 md:p-8">
                    <h1 className="mb-2 text-2xl md:text-4xl font-bold">{name}</h1>

                    <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center">
                        <p className={`text-gray-500 text-lg md:text-2xl ${discount_price && 'line-through'}`}>
                            {price} BDT
                        </p>
                        {discount_price && (
                            <>
                                <p className="font-bold text-red-600 text-lg md:text-2xl">
                                    {discount_price} BDT
                                </p>
                                <p className="px-2 py-1 text-sm text-white bg-red-500 rounded">
                                    {Math.round(((price - discount_price) / price) * 100)}% Off
                                </p>
                            </>
                        )}
                    </div>

                    <p className="my-5" dangerouslySetInnerHTML={{ __html: sanitizedshort_description }}></p>

                    <div className="flex items-center mb-4">
                        {
                            status ? (
                                <span className="px-4 py-2 font-medium text-white bg-green-500">Available</span>
                            ) :
                                <span className="px-4 py-2 font-medium text-white bg-red-500">Unavailable</span>
                        }
                    </div>

                    <div className="space-y-4">
                        {(variants && variants.length > 0) &&
                            JSON.parse(variants).map((variant, index) => (
                                variant.values && (
                                    <div key={index} className="space-y-2">
                                        <h3 className="text-lg font-medium">{variant.attribute}</h3>
                                        <div className="flex space-x-2 flex-wrap">
                                            {variant.values.split(',').map((v, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleVariantClick(variant.attribute, v)}
                                                    className={`px-4 py-2 border rounded-lg ${selectedVariants[index]?.values === v
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-black'
                                                        }`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-2 items-center my-6 space-x-4">
                        {
                            cartLoading ? <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i> :
                                (Object.keys(cartItem).length > 0 && cartItem.quantity > 0) ? (
                                    <>
                                        <input
                                            type="number"
                                            value={cartItem.quantity}
                                            min="1"
                                            className="w-16 text-center border rounded-lg"
                                            onChange={(e) => e.target.value > 0 && addToCart(cartItem.product.id, parseInt(e.target.value), JSON.stringify(selectedVariants))}
                                        />
                                        <button className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600" onClick={() => removeFromCart(cartItem.id)}>
                                            Remove from Cart
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" onClick={() => (addToCart(product.id, 1, JSON.stringify(selectedVariants)), fbq('track', 'AddToCart', {
                                            content_name: product.name,
                                            content_category: product.category.name,
                                            value: product.discount_price || product.price,
                                            currency: 'BDT'
                                        }))}>
                                            Add to Cart
                                        </button>
                                        <button className="px-4 py-2 text-gray-700 bg-yellow-500 rounded-lg hover:bg-yellow-600" onClick={() => {
                                            fbq('track', 'AddToCart', {
                                                content_name: product.name,
                                                content_category: product.category.name,
                                                value: product.discount_price || product.price,
                                                currency: 'BDT'
                                            })
                                            addToCart(product.id, 1, JSON.stringify(selectedVariants)).then(() => router.visit(route('home.checkout')));
                                        }}>
                                            Order Now
                                        </button>
                                    </>
                                )}
                    </div>
                </div>
            </div>

            <div className="prose max-w-none">
                <p className="p-4 md:p-8 rounded-lg md:text-justify" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
            </div>

            {/* Related Products Section */}
            {
                product.category?.products.length > 0 && (
                    <div className="mt-10">
                        <h2 className="mb-6 text-xl md:text-2xl font-bold">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {product.category.products.map((prod, i) => (
                                <ProductCart product={prod} key={i} />
                            ))}
                        </div>
                    </div>
                )
            }

        </div>
    );

};

const ProductDetail = ({ product }) => {
    return (
        <AppLayout>
            <Head title={product.name} />
            <Index product={product} />
        </AppLayout>
    )
}

export default ProductDetail;
