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
            <div className="relative w-full p-4 overflow-hidden h-96">
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
    const { id, category_id, name, description, variants, price, images, discount_price, status, created_at, updated_at } = product;
    const [products, setproducts] = useState([])
    const sanitizedDescription = DOMPurify.sanitize(description);
    const [selectedVariants, setSelectedVariants] = useState([])
    const cartItem = cart.cart_items?.find(item => item.product_id === product.id);

    useEffect(() => {
        axios.get(route('home.related_products', category_id)).then(response => {
            setproducts(response.data)
        })
    }, [category_id])


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
        <div className="container p-8 mx-auto bg-white">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Image Section */}
                <ImageGallery images={JSON.parse(images)} />

                {/* Product Information Section */}
                <div className="p-8 rounded-lg">
                    <h1 className="mb-2 text-4xl font-bold">{name}</h1>

                    <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center">
                        <p className="text-gray-500 line-through md:text-3xl">
                            <span className="text-4xl bold">৳</span> {price}
                        </p>
                        {discount_price && (
                            <>
                                <p className="font-bold text-red-600 md:text-3xl">
                                    <span className="text-4xl bold">৳</span> {discount_price}
                                </p>
                                <p className="px-2 py-1 text-sm text-white bg-red-500 rounded">
                                    {Math.round(((price - discount_price) / price) * 100)}% Off
                                </p>
                            </>
                        )}
                    </div>


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
                                variant.values.split(',').length > 0 && (
                                    <div key={index} className="space-y-2">
                                        {/* Render variant attribute name */}
                                        <h3 className="text-lg font-medium">{variant.attribute}</h3>
                                        <div className="flex space-x-2">
                                            {/* Render buttons for each variant value */}
                                            {variant.values.split(',').map((v, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleVariantClick(variant.attribute, v)}
                                                    className={`px-4 py-2 border ${selectedVariants[index]?.values === v
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
                    <div className="flex items-center my-6 space-x-4">
                        {cartLoading ? <i className="self-center mb-3 text-2xl fa fa-spinner animate-spin"></i> : <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" onClick={() => addToCart(product, null, JSON.stringify(selectedVariants))}>
                            Add to Cart
                        </button>}
                        <button className="px-4 py-2 text-gray-700 bg-yellow-500 rounded-lg hover:bg-yellow-600" onClick={() => {
                            cartItem?.id ? router.visit(route('home.checkout')) : addToCart(product, null, JSON.stringify(selectedVariants)).then(() => router.visit(route('home.checkout')));
                        }}>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="prose max-w-none">
                <pre className="p-8 rounded-lg shadow-sm text-wrap text-justify" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}>
                </pre>
            </div>

            {/* Related Products Section */}
            <div className="mt-10">
                <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {
                        products.map((product, i) => (
                            <ProductCart product={product} key={i} />
                        ))
                    }
                </div>
            </div>
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
