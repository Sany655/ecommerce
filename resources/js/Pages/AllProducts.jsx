import AppLayout from "@/Layouts/AppLayout"
import { Head } from "@inertiajs/react"
import { useEffect } from "react"
import useCart from "@/Hooks/useCart"
import NavLink from "@/Components/NavLink"
import PrimaryButton from "@/Components/PrimaryButton"
import ProductCart from "@/Components/ProductCart"

function AllProducts({ category }) {
    return (
        <AppLayout>
            <Head title={category.name} />
            <Index category={category} />
        </AppLayout>
    )
}

const Index = ({ category }) => {

    return (
        <div className="my-12">
            <div className="flex justify-between items-center border-b border-1 mb-5 pb-4">
                <h1 className="text-4xl font-bold capitalize">{category.name}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {
                    category.products.map((product, i) => (
                        <ProductCart product={product} key={i}/>
                    ))
                }
            </div>
        </div>
    )
}
export default AllProducts
