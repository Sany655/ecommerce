import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

function CategoryEditForm({ category, categories }) {
    const [catEditModal, setCatEditModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm();
    const [attribute, setAttribute] = useState('')

    useEffect(() => {
        setData({
            _method: "PATCH",
            name: category.name,
            description: category.description || "",
            attributes: category.attributes || "",
            parent_id: category.parent_id,
            banner: null,
            status: category.status
        });
    }, [category]);


    const UpdateCategory = (e) => {
        e.preventDefault();
        post(route("category.update", category.id), {
            onSuccess: () => {
                setCatEditModal(false);
            },
            preserveScroll: true
        });
    };

    return (
        <>
            <SecondaryButton onClick={() => setCatEditModal(true)}>
                Edit Category/Subcategory
            </SecondaryButton>
            <Modal onClose={() => setCatEditModal(!catEditModal)} show={catEditModal}>
                <div className="p-5">
                    <h3 className="flex items-center justify-between mb-3 text-2xl font-bold">
                        <span>Edit Category</span>
                        <i className="fa fa-close cursor-pointer" onClick={() => setCatEditModal(false)}></i>
                    </h3>
                    <form className="space-y-6" onSubmit={UpdateCategory} encType="multipart/form-data">
                        {/* Name Input */}
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <TextInput
                                required
                                id="name"
                                placeholder="Enter category name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                            />
                            <InputError message={errors.name} className="mt-2 text-sm text-red-500" />
                        </div>

                        {/* Description Input */}
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TextArea
                                required
                                id="description"
                                name="description"
                                placeholder="Enter category description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                            />
                            <InputError message={errors.description} className="mt-2 text-sm text-red-500" />
                        </div>

                        {/* attributes Input */}
                        <div className="flex flex-col">
                            <label htmlFor="attributes" className="text-sm font-medium text-gray-700">
                                Category Attributes <small>(attribute-1,attribute-2,attribute-3,etc)</small>
                            </label>
                            <input
                                id="attributes"
                                name="attributes"
                                placeholder="Enter category attributes"
                                value={data.attributes}
                                onChange={(e) => setData("attributes", e.target.value)}
                                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                            />
                            <InputError message={errors.attributes} className="mt-2 text-sm text-red-500" />
                        </div>

                        {/* Banner Input */}
                        <div className="flex flex-col">
                            <label htmlFor="banner" className="text-sm font-medium text-gray-700">
                                Upload Banner Image
                            </label>
                            <input
                                type="file"
                                id="banner"
                                name="banner"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        setData('banner', e.target.files[0]);
                                    }
                                }}
                                accept="image/*"
                                className="mt-1 focus:ring-2 focus:ring-indigo-300"
                            />
                            <InputError message={errors.banner} className="mt-2 text-sm text-red-500" />
                        </div>

                        {/* Category Selection */}
                        {categories.length > 0 && (
                            <div className="flex flex-col">
                                <label htmlFor="parent_id" className="text-sm font-medium text-gray-700">
                                    Parent Category (Optional)
                                </label>
                                <SelectInput
                                    id="parent_id"
                                    name="parent_id"
                                    value={data.parent_id || ""}
                                    onChange={(e) => setData("parent_id", e.target.value)}
                                    className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"
                                >
                                    <option value="">Select Category to use as subcategory</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                        )}

                        {/* Status Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="status" className="ml-2 text-sm font-medium text-gray-700">
                                Assign for display
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-between">
                            <SecondaryButton onClick={() => setCatEditModal(!catEditModal)} className="text-gray-600 hover:text-gray-800">
                                Close
                            </SecondaryButton>
                            <PrimaryButton
                                disabled={processing}
                                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Update
                            </PrimaryButton>
                        </div>
                    </form>

                </div>
            </Modal>
        </>
    );
}

export default CategoryEditForm;
