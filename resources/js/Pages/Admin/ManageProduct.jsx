import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import ProductCreateForm from '@/Forms/ProductCreateForm';
import ProductEditForm from '@/Forms/ProductEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function ManageProduct(props) {
    const { category } = props;
    const products = category.products;

    const handleDelProd = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            router.delete(`/product/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{category.name}</h2>}
        >
            <Head title="Manage Products" />

            <div className="py-12 mt-2 bg-white rounded h-screen">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold">{category.name} products</h2>
                        </div>
                        <ProductCreateForm category={_.omit(category, 'products')} />
                    </div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {
                                products.map((product, i) => (
                                    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow" key={i}>
                                        <img
                                            className="w-full"
                                            src={product.images && JSON.parse(product.images).length > 0
                                                ? `/storage/${JSON.parse(product.images)[0]}`
                                                : '/images/default-product.png'}
                                            alt={product.name}
                                        />
                                        <div className="p-5 bg-gray-50">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                                                {product.name}
                                            </h5>
                                            <div className="flex flex-wrap justify-center gap-4">
                                                <ProductEditForm product={product} />
                                                {product.images && product.images.length > 0 && (
                                                    <UpdateImages id={product.id} images={JSON.parse(product.images)} />
                                                )}
                                                <DangerButton className="" onClick={() => handleDelProd(product.id)}>
                                                    Delete Product
                                                </DangerButton>
                                            </div>
                                        </div>
                                    </div>

                                ))
                            }

                        </div>
                    ) : <p className="my-40 text-center">No product availabe</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

function UpdateImages({ id, images }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    function handleImageDelete(img) {
        router.delete(route('product.delete_image', id), { data: { img: img }, preserveScroll: true });
    }
    return (
        <>
            <PrimaryButton onClick={() => setIsModalOpen(true)}>Update Images</PrimaryButton>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {
                        images.map((image, i) => (
                            <div key={i} className="relative h-64 bg-center bg-cover" style={{ backgroundImage: `url('/storage/${image}')` }}>
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <div className="relative flex items-center justify-center h-full text-white">
                                    <div className="flex flex-col justify-center gap-2 items-between">
                                        <h1 className="mb-4 text-4xl font-bold">{i + 1}</h1>
                                        <i className="text-red-500 cursor-pointer fa fa-trash" onClick={() => handleImageDelete(image)}></i>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            </Modal>
        </>
    )
}

export default ManageProduct
