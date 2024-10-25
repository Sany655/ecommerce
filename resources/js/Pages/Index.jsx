import Carousel from '@/Components/Carousel'
import NavLink from '@/Components/NavLink'
import PrimaryButton from '@/Components/PrimaryButton'
import AppLayout from '@/Layouts/AppLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import ProductCard from '@/Components/ProductCard'

function Index({ categories, banner }) {
    return (
        <AppLayout>
            <Head title='Home' />
            <Child {...{ categories, banner }} />
        </AppLayout>
    )
}

const Child = ({ categories, banner }) => {
    return (
        <>
            {banner.length > 0 ? <Carousel categories={banner} interval={3000} /> : <p className='text-center my-60'>Site is under maintanance, visit later!</p>}
            {
                categories.filter(cat => cat.products.length > 0 && cat).map((category, index) => (
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
            }
        </>
    )
}

export default Index
