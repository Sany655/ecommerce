import DangerButton from '@/Components/DangerButton';
import ProductCreateForm from '@/Forms/ProductCreateForm';
import ProductEditForm from '@/Forms/ProductEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function ManageOrder(props) {
    const { products, categories } = props;

    // const handleDeleteCat = (id) => {
    //     if (window.confirm("Are you sure you want to delete this product?")) {
    //         router.delete(`product/${id}`, { preserveScroll: true });
    //     }
    // };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}
        >
            <Head title="Manage Orders" />

            {/* <div className="bg-white rounded py-12 mt-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Products</h2>
                        </div>
                        <ProductCreateForm categories={categories} />
                    </div>
                    {products.data.length > 0 ? (
                        <>
                            <table className='min-w-full bg-white border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                                        <th className='py-3 px-6 text-center'>Name</th>
                                        <th className='py-3 px-6 text-center'>Description</th>
                                        <th className='py-3 px-6 text-center'>Category</th>
                                        <th className='py-3 px-6 text-center'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.data.map((product, i) => (
                                            <tr key={i} className='py-3 px-6 text-center border-b'>
                                                <td className='border'>{product.name}</td>
                                                <td className='border'>{product.description}</td>
                                                <td className='border'>{product.category.name}</td>
                                                <td className='flex items-center gap-2 p-4'>
                                                    <ProductEditForm product={product} categories={categories} />
                                                    <p className="text-red-500" onClick={() => handleDeleteCat(product.id)}>Delete</p>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-center">
                                {products.links.map((link, index) => (
                                    <Link key={index} href={link.url} as="button" type="button" className={`px-4 py-2 mx-1 rounded border ${link.active ? 'bg-black text-white' : 'bg-white text-black'}`} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </>
                    ) : <p className="my-40 text-center">No product availabe</p>}
                </div>
            </div> */}
        </AuthenticatedLayout>
    );
}

export default ManageOrder;
