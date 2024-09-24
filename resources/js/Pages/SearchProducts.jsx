import ProductCart from "@/Components/ProductCart"
import AppLayout from "@/Layouts/AppLayout"
import { Head } from "@inertiajs/react"

function Index({ products }) {
    return (
        <div className="my-12">
            <h1 className="text-4xl font-bold text-start mb-4">Searched Item</h1>
            <hr />
            {
                products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {products.map((product, i) => <ProductCart product={product} key={i} />)}
                    </div>
                ) : <p className='my-60 text-center'>No products found.</p>
            }

        </div>
    )
}

function SearchProducts({ products }) {
    return (
        <AppLayout>
            <Head title={"Search"} />
            <Index products={products} />
        </AppLayout>
    )
}
export default SearchProducts
