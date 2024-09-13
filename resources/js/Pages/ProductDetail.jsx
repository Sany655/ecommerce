import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import useCart from "@/Hooks/useCart"
import ProductCart from "@/Components/ProductCart";
import axios from "axios";

const Index = ({ product }) => {
    const { cart, addToCart, removeFromCart } = useCart()
    const props = usePage().props;
    const { id, category_id, name, description, price, image, discount_price, coupon_price, coupon_code, status, created_at, updated_at } = product;
    const [products, setproducts] = useState([])
    const [couponError, setCouponError] = useState('')

    useEffect(() => {
        axios.get(route('home.related_products', category_id)).then(response => {
            setproducts(response.data)
        })
        setCouponError('');
    }, [category_id])

    const applyCouponCode = (e) => {
        e.preventDefault();
        if (e.target.coupon_code.value === coupon_code) {
            alert('server error! try again later.');
        }
        else {
            setCouponError('Invalid coupon code!');
        }
        e.target.coupon_code.value = '';
    }

    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="flex flex-col">
                    <img
                        src={'/storage/' + image}
                        alt={`Product Image ${name}`}
                        className="mb-4 object-cover w-full rounded-lg shadow-md"
                    />
                </div>

                {/* Product Information Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-2">{name}</h1>
                    {discount_price ? (
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <span className="md:text-3xl text-gray-500 line-through">
                                ${price}
                            </span>
                            <span className="md:text-3xl font-bold text-red-600">
                                ${discount_price}
                            </span>
                            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                                {Math.round(((price - discount_price) / price) * 100)}% Off
                            </span>
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

                    <p className="text-gray-700 text-lg mb-4">{description}</p>


                    {/* Coupon Section */}
                    <form onSubmit={applyCouponCode} className="flex w-full mt-8 ms-auto">
                        <input
                            type="text"
                            placeholder="Coupon code"
                            className="border px-4 py-2 w-1/2 rounded-l-lg"
                            name="coupon_code"
                        />
                        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-r-lg hover:bg-orange-600">
                            Apply coupon
                        </button>
                    </form>
                    {couponError && <span className="text-red-500">{couponError}</span>}

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 my-6">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                            Order Now
                        </button>
                    </div>
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
