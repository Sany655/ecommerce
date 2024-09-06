import DangerButton from '@/Components/DangerButton';
import ProductCreatForm from '@/Forms/ProductCreatForm';
import ProductEditForm from '@/Forms/ProductEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

function ManageProduct(props) {
    const { products, categories } = props;

    const handleDeleteCat = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            router.delete(`product/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Manage Products" />

            <div className="bg-white rounded py-12 mt-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center flex-wrap gap-2">
                            <h2 className="text-lg font-semibold">Products</h2>
                        </div>
                        <ProductCreatForm categories={categories} />
                    </div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4">
                            {
                                products.map((product, i) => (
                                    <div key={i} className="relative bg-cover bg-center h-64 mb-3" style={{ backgroundImage: `url('storage/${product.image}')` }}>
                                        <div className="absolute inset-0 bg-black opacity-50"></div>
                                        <div className="relative flex items-center justify-center h-full text-white">
                                            <div className="text-center flex flex-col gap-2">
                                                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                                                <p className="text-lg mb-2">{product.description}</p>
                                                {/* <PrimaryButton onClick={()=>route('product.index')}>Manage Products</PrimaryButton> */}
                                                <ProductEditForm product={product} categories={categories} />
                                                <DangerButton onClick={() => handleDeleteCat(product.id)}>Delete product</DangerButton>
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
    );
}

export default ManageProduct;
