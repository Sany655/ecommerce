import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextInput from "@/Components/TextInput"
import { router, useForm } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import JoditEditor from 'jodit-react';

function ProductCreateForm({ category }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: category.id,
        name: '',
        description: '',
        variants: category.attributes ? JSON.stringify(category.attributes.split(',').map((attr) => ({ attribute: attr, values: '' }))) : JSON.stringify([]),
        price: '',
        images: [],
        discount_price: '',
        status: true,
    });
    const [prodCreateModal, setProdCreateModal] = useState(false)
    
    const handleCreateProduct = (e) => {
        e.preventDefault();
        if (!data.category_id) {
            alert('Please select a category for the product.');
        } else {
            post(route('product.store'), {
                onSuccess: () => {
                    reset();
                    setProdCreateModal(false);
                },
                onError: e => console.log(e)
            });
        }
    };

    return (
        <>
            <PrimaryButton onClick={() => setProdCreateModal(true)}>Add Product</PrimaryButton>
            <Modal onClose={() => setProdCreateModal(!prodCreateModal)} show={prodCreateModal}>
                <div className="p-5">
                    <h3 className="flex items-center justify-between mb-3 text-xl font-bold">
                        <span>Create Product</span>
                        <i className="cursor-pointer fa fa-close" onClick={() => setProdCreateModal(false)}></i>
                    </h3>

                    <form className="flex flex-col gap-5" onSubmit={handleCreateProduct}>
                        <div className="flex flex-col">
                            <InputLabel htmlFor="name">Product Name *</InputLabel>
                            <TextInput
                                className="w-full"
                                id="name"
                                required
                                placeholder="Name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="flex flex-col">
                            <InputLabel htmlFor="description">Product Description *</InputLabel>
                            <JoditEditor
                                required
                                value={data.description}
                                onChange={(value) => setData("description", value)}
                                className="text-black bg-white rounded-lg shadow-md"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex flex-col">
                            <InputLabel htmlFor="variants">Product Variants <small>(variant1,variant2,variant3,etc)</small></InputLabel>
                            <div className="grid grid-cols-2 gap-5 space-5">
                                {(data.variants.length > 0) ? JSON.parse(data.variants).map((variant, i) => (
                                    <div key={i} className="flex gap-2">
                                        {variant.attribute}: <input
                                            type="text"
                                            placeholder={`Enter value for ${variant.attribute}`}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                            value={variant.values}
                                            onChange={(e) =>
                                                setData('variants', JSON.stringify(JSON.parse(data.variants).map((v, index) => (index === i ? { ...v, values: e.target.value } : v))))
                                            }
                                        />
                                    </div>
                                )) : null}
                            </div>
                            <InputError message={errors.variants} className="mt-2 text-sm text-red-500" />
                        </div>

                        <div className="flex flex-col">
                            <InputLabel htmlFor="images">Product Images</InputLabel>
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        const files = Array.from(e.target.files).slice(0, 10);
                                        setData("images", files);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                            <InputError message={errors.images} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col">
                                <InputLabel htmlFor="price">Price *</InputLabel>
                                <TextInput
                                    required
                                    id="price"
                                    placeholder="Price"
                                    name="price"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    type="number"
                                    className="w-full"
                                />
                                <InputError message={errors.price} className="mt-2" />
                            </div>

                            <div className="flex flex-col">
                                <InputLabel htmlFor="discount_price">Discount Price</InputLabel>
                                <TextInput
                                    id="discount_price"
                                    placeholder="Discount Price"
                                    name="discount_price"
                                    value={data.discount_price}
                                    onChange={(e) => setData("discount_price", e.target.value)}
                                    type="number"
                                    className="w-full"
                                />
                                <InputError message={errors.discount_price} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="status"
                                checked={data.status}
                                onChange={(e) => setData("status", e.target.checked)}
                            />
                            <InputLabel htmlFor="status">Assign for display</InputLabel>
                        </div>

                        <div className="flex items-center justify-between mt-5">
                            <SecondaryButton onClick={() => setProdCreateModal(false)}>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Create</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    )
}
export default ProductCreateForm
