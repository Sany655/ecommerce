import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import ProductCreateForm from '@/Forms/ProductCreateForm';
import ProductEditForm from '@/Forms/ProductEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function ManageCategoryProducts(props) {
    const { category, products } = props;

    const handleDelProd = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            router.delete(`/product/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{category.name}</h2>}
        >
            <Head title="Manage Products" />

            <div className="bg-white rounded py-12 mt-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center flex-wrap gap-2">
                            <h2 className="text-lg font-semibold">{category.name} products</h2>
                        </div>
                        <ProductCreateForm category={category.id} />
                    </div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4">
                            {
                                products.map((product, i) => (
                                    <div key={i} className="relative bg-cover bg-center h-64 mb-3" style={{ backgroundImage: `url('/storage/${JSON.parse(product.images)[0]}')` }}>
                                        <div className="absolute inset-0 bg-black opacity-50"></div>
                                        <div className="relative flex items-center justify-center h-full text-white">
                                            <div className="flex flex-col gap-2 items-between justify-center">
                                                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                                                <ProductEditForm product={product} />
                                                <UpdateImages id={product.id} images={JSON.parse(product.images)} />
                                                <DangerButton onClick={() => handleDelProd(product.id)}>Delete product</DangerButton>
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
                            <div key={i} className="relative bg-cover bg-center h-64" style={{ backgroundImage: `url('/storage/${image}')` }}>
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <div className="relative flex items-center justify-center h-full text-white">
                                    <div className="flex flex-col gap-2 items-between justify-center">
                                        <h1 className="text-4xl font-bold mb-4">{i + 1}</h1>
                                        <i className="fa fa-trash text-red-500 cursor-pointer" onClick={() => handleImageDelete(image)}></i>
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

export default ManageCategoryProducts
