import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import './editor.css'
import axios from "axios";

function ProductEditForm({ product }) {
    const [prodEditModal, setProdEditModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({});
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get(route('categories.get_all')).then(response => {
            setCategories(response.data)
        })
        setData({
            _method: "PATCH",
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            variants: (JSON.parse(product.variants)?.length > 0 && product.variants) || (product.category.attributes ? JSON.stringify(product.category.attributes.split(',').map((attr) => ({ attribute: attr, values: '' }))) : JSON.stringify([])),
            images: [],
            price: product.price,
            discount_price: product.discount_price || '',
            status: product.status
        });
    }, [product]);


    const UpdateProduct = (e) => {
        e.preventDefault();
        post(route("product.update", product.id), {
            forceFormData: true,
            onSuccess: () => {
                setProdEditModal(false);
            },
            preserveScroll: true
        });
    };

    return (
        <>
            <SecondaryButton onClick={() => setProdEditModal(true)}>
                Edit Product
            </SecondaryButton>
            <Modal onClose={() => setProdEditModal(!prodEditModal)} show={prodEditModal}>
                <div className="p-5">
                    <h3 className="flex items-center justify-between mb-3 text-2xl font-bold">
                        <span>Edit Product</span>
                        <i className="fa fa-close" onClick={() => setProdEditModal(false)}></i>
                    </h3>
                    <form className="flex flex-col gap-5" onSubmit={UpdateProduct}>
                        <div className="grid-cols-2 gap-2 md:grid">
                            <div className="">
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

                            <div className="">
                                <InputLabel htmlFor="category_id">Category</InputLabel>
                                <SelectInput
                                    className="w-full"
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id} defaultValue={product.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="description">Product Description *</InputLabel>
                            <JoditEditor
                                required
                                value={data.description}
                                onChange={(value) => setData("description", value)}
                                className="text-black rounded-lg overflow-auto"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex flex-col">
                            <InputLabel htmlFor="variants">Product Variants <small>(variant1,variant2,variant3,etc)</small></InputLabel>
                            <div className="grid grid-cols-2 gap-5 space-5">
                                {data.variants?.length > 0 ? JSON.parse(data.variants).map((variant, i) => (
                                    <div key={i} className="flex gap-2">
                                        {variant.attribute}: <input
                                            type="text"
                                            placeholder={`Enter value for ${variant.attribute}`}
                                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
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
                            <SecondaryButton onClick={() => setProdEditModal(false)}>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default ProductEditForm;
