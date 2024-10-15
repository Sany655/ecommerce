import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextArea from "@/Components/TextArea"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

function CategoryCreateForm({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        banner: null,
        parent_id: null,
        attributes: '',
        status: true
    });
    const [catCreateModal, setCatCreateModal] = useState(false)
    const [attribute, setAttribute] = useState('')

    const handleCreateCategory = (e) => {
        e.preventDefault();
        post(route('category.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setCatCreateModal(false); },
        });
    };
    return (
        <>
            <PrimaryButton onClick={() => setCatCreateModal(true)}>Add Category/Subcategory</PrimaryButton>
            <Modal onClose={() => setCatCreateModal(!catCreateModal)} show={catCreateModal}>
                <div className="p-5">
                    <h3 className='mb-3 text-2xl font-bold flex justify-between items-center'>
                        <span>Create Category</span>
                        <i className="fa fa-close" onClick={() => setCatCreateModal(false)}></i>
                    </h3>
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={handleCreateCategory}
                        encType="multipart/form-data"
                    >
                        {/* Name Input */}
                        <div>
                            <InputLabel htmlFor="name">Category Name</InputLabel>
                            <TextInput
                                required
                                id="name"
                                name="name"
                                placeholder="Enter category name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.name} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Description Input */}
                        <div>
                            <InputLabel htmlFor="description">Description</InputLabel>
                            <TextArea
                                required
                                id="description"
                                name="description"
                                placeholder="Enter category description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.description} className="mt-2 text-red-500 text-sm" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name">Category Attributes</InputLabel>
                            <ul className="flex gap-2 m-2">
                                {
                                    data.attributes.length > 0 && data.attributes.split(',').map((att, i) => (
                                        <li className="border shadow-md px-2" key={i}>{att} <i className="fa fa-close" onClick={() => setData('attributes', data.attributes.split(',').filter(at => at !== att).join(','))}></i></li>
                                    ))
                                }
                            </ul>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Enter attribute"
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    value={attribute}
                                    onChange={(e) => setAttribute(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    onClick={() => setData('attributes', (data.attributes.length > 0 ? data.attributes + ',' : '') + attribute) & setAttribute('')}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                            <InputError message={errors.name} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Banner Input */}
                        <div>
                            <InputLabel htmlFor="banner">Category Banner</InputLabel>
                            <input
                                type="file"
                                id="banner"
                                name="banner"
                                required
                                onChange={(e) => setData('banner', e.target.files[0])}
                                accept="image/*"
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.banner} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Parent Category Select */}
                        {categories.length > 0 && (
                            <div>
                                <InputLabel htmlFor="parent_id">Parent Category</InputLabel>
                                <SelectInput
                                    id="parent_id"
                                    name="parent_id"
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                                >
                                    <option value="">Select Category to use it as subcategory</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </SelectInput>
                            </div>
                        )}

                        {/* Status Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <InputLabel htmlFor="status" className="text-sm text-gray-700">Assign for display</InputLabel>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-4">
                            <SecondaryButton
                                type="button"
                                onClick={() => setCatCreateModal(!catCreateModal)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Close
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Create
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
export default CategoryCreateForm
