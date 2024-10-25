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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Categories/Subcategories</h2>}
        >
            <Head title="Manage Categories" />

            <div className="p-2 mt-2 bg-white rounded">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <CategoryCreateForm categories={categories} />
                    </div>
                    {categories.length > 0 ? categories.map((category, i) => (
                        <div key={i} className="relative mb-3 bg-center bg-cover" style={{ backgroundImage: `url('storage/${category.banner}')` }}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative p-10 text-white">
                                <div className="flex flex-col gap-2 text-center">
                                    <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
                                    <p className="mb-2 text-lg ">{category.description}</p>
                                    <p className="mb-2 text-lg ">{category.attributes}</p>
                                    <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                                        <Link href={route('category.show', category.id)} className='px-2 py-1 border rounded hover:border-black hover:text-black hover:bg-white'>Manage related products</Link>
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
