import DangerButton from '@/Components/DangerButton';
import CategoryCreateForm from '@/Forms/CategoryCreateForm';
import CategoryEditForm from '@/Forms/CategoryEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

function ManageCategory(props) {
    const { categories } = props;

    const handleDeleteCat = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            router.delete(`category/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Categories/Subcategories</h2>}
        >
            <Head title="Manage Categories" />

            <div className="bg-white rounded py-12 mt-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center flex-wrap gap-2">
                            <h2 className="text-lg font-semibold">Categories</h2>
                        </div>
                        <CategoryCreateForm categories={categories} />
                    </div>
                    {categories.length > 0 ? categories.map((category, i) => (
                        <div key={i} className="relative bg-cover bg-center mb-3" style={{ backgroundImage: `url('storage/${category.banner}')` }}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative text-white p-10">
                                <div className="text-center flex flex-col gap-2">
                                    <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                                    <p className="text-lg mb-2 ">{category.description}</p>
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                        <Link href={route('category.show', category.id)} className='border rounded py-1 px-2 hover:border-black hover:text-black hover:bg-white'>Manage related products</Link>
                                        <CategoryEditForm category={category} categories={categories} />
                                        <DangerButton onClick={() => handleDeleteCat(category.id)}>Delete category with corresponding products</DangerButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <p className="my-40 text-center">No category availabe</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ManageCategory;
