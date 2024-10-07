import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import useCart from "@/Hooks/useCart"
import ProductCart from "@/Components/ProductCart";
import axios from "axios";
import DOMPurify from "dompurify";

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
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
            <div className="relative w-full h-96 overflow-hidden p-4">
                <img
                    ref={imageRef}
                    src={'/storage/' + selectedImage}
                    alt="Product Image"
                    className="w-full h-full object-cover"
                    style={zoomStyle}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={resetZoom}
                />
                <button
                    onClick={openFullscreen}
                    className="absolute top-2 right-2 bg-white rounded-full text-blue-500 w-10 h-10"
                >
                    <i className="fa fa-magnifying-glass"></i>
                </button>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
                {images.map((image, index) => (
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
    const { cart, addToCart, removeFromCart } = useCart()
    const { id, category_id, name, description, price, images, discount_price, coupon_price, coupon_code, status, created_at, updated_at } = product;
    const [products, setproducts] = useState([])
    const [couponError, setCouponError] = useState('')
    const sanitizedDescription = DOMPurify.sanitize(description);
    useEffect(() => {
        axios.get(route('home.related_products', category_id)).then(response => {
            setproducts(response.data)
        })
        setCouponError('');
    }, [category_id])

    const applyCouponCode = (e) => {
        e.preventDefault();
        if (e.target.coupon_code.value === coupon_code) {
            setCouponError('server error! try again later.');
        }
        else {
            setCouponError('Invalid coupon code!');
        }
        e.target.coupon_code.value = '';
    }

    return (
        <div className="container bg-white mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <ImageGallery images={JSON.parse(images)} />

                {/* Product Information Section */}
                <div className="p-8 rounded-lg">
                    <h1 className="text-4xl font-bold mb-2">{name}</h1>
                    {discount_price ? (
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <p className="md:text-3xl text-gray-500 line-through">
                                <span className="text-4xl bold">৳</span> {price}
                            </p>
                            <p className="md:text-3xl font-bold text-red-600">
                                <span className="text-4xl bold">৳</span> {discount_price}
                            </p>
                            <p className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                                {Math.round(((price - discount_price) / price) * 100)}% Off
                            </p>
                        </div>
                    ) : (
                        <p className="text-3xl font-bold mb-4">${price}</p>
                    )}

                    <div className="flex items-center mb-4">
                        {
                            status ? (
                                <span className="font-medium bg-green-500 px-4 py-2 text-white">Available</span>
                            ) :
                                <span className="font-medium bg-red-500 px-4 py-2 text-white">Unavailable</span>
                        }
                    </div>

                    {/* Coupon Section */}
                    {
                        coupon_code && coupon_price && (

                            <form onSubmit={applyCouponCode} className="flex w-full mt-8 ms-auto">
                                <input
                                    type="text"
                                    placeholder="Coupon code"
                                    className="border px-4 py-2 w-1/2 rounded-l-lg"
                                    name="coupon_code"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600">
                                    Apply coupon
                                </button>
                                {couponError && <span className="text-red-500">{couponError}</span>}
                            </form>
                        )
                    }

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 my-6">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={() => {
                            addToCart(product).then(() => router.visit(route('home.checkout')));
                        }}>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="prose max-w-none">
                <div className="p-8 rounded-lg shadow-lg" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}>
                </div>
            </div>

            {/* Related Products Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
