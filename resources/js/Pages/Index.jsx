import Carousel from '@/Components/Carousel'
import NavLink from '@/Components/NavLink'
import PrimaryButton from '@/Components/PrimaryButton'
import AppLayout from '@/Layouts/AppLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'
import ProductCard from '@/Components/ProductCard'

function Index({ products }) {

    return (
        <AppLayout>
            <Head title='Home' />
            <Child products={products} />
        </AppLayout>
    )
}

const Child = ({ products }) => {
    return (
        <>
            {/* {banner.length > 0 ? <Carousel categories={banner} interval={3000} /> : <p className='text-center my-60'>Site is under maintanance, visit later!</p>} */}
            <div className="">
                <img
                    src="images/banner.jpg"
                    alt={`Banner image Simplibazaar, variety of products`}
                    className="w-full object-cover"
                />
            </div>
            {/* {
                categories.filter(cat => cat.products.length > 0).map((category, index) => (
                    <div className="my-12" key={index}>
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-1">
                            <h1 className="texl-2xl md:text-4xl font-bold capitalize">{category.name}</h1>
                            <NavLink className="text-sm font-bold text-gray-400" href={route('home.category_products', category.id)}>View all</NavLink>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 space-4">
                            {
                                category.products.map((product, i) => (
                                    <ProductCard product={product} key={i} />
                                ))
                            }
                        </div>
                    </div>
                ))
            } */}
            {
                <div className="my-12">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 space-4">
                        {
                            products.data.map((product, i) => (
                                <ProductCard product={product} key={i} />
                            ))
                        }
                    </div>
                </div>
            }
            {products.links && products.links.length > 3 && <div className="mt-4 flex justify-center">
                {products.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        as="button"
                        type="button"
                        className={`px-4 py-2 mx-1 rounded border ${link.active ? 'bg-black text-white' : 'bg-white text-black'}`}
                        disabled={!link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>}
        </>
    )
}

export default Index
