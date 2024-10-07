import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';

function ProductEditForm({ product, categories = [] }) {
    const [prodEditModal, setProdEditModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm();

    useEffect(() => {
        setData({
            _method: "PATCH",
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            images: [],
            price: product.price,
            discount_price: product.discount_price || '',
            status: product.status,
            coupon_code: product.coupon_code || '',
            coupon_price: product.coupon_price || ''
        });
    }, [product]);


    const UpdateProduct = (e) => {
        e.preventDefault();
        post(route("product.update", product.id), {
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
                    <h3 className="mb-3 text-2xl font-bold flex justify-between items-center">
                        <span>Edit Product</span>
                        <i className="fa fa-close" onClick={() => setProdEditModal(false)}></i>
                    </h3>
                    <form className="flex flex-col gap-5" onSubmit={UpdateProduct} encType="multipart/form-data">
                        <div>
                            <InputLabel htmlFor="name">Product Name</InputLabel>
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
                            <InputLabel htmlFor="description">Product Description</InputLabel>
                            <ReactQuill
                                required
                                theme="snow"
                                value={data.description}
                                onChange={(value) => setData("description", value)}
                                className="bg-white text-black rounded-lg shadow-md"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    const files = Array.from(e.target.files).slice(0, 10);
                                    setData('images', files);
                                }
                            }}
                            accept="image/*"
                        />
                        <InputError message={errors.image} className="mt-2" />

                        {categories.length > 0 && (
                            <div className="">
                                <InputLabel htmlFor="category_id">Category</InputLabel>
                                <SelectInput
                                    className="w-full"
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id || ""} // Set value for category_id
                                    onChange={(e) => setData("category_id", e.target.value)}
                                >
                                    <option value={""}>Select Product to use it as subproduct</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                        )}


                        <div className="">
                            <InputLabel htmlFor="price">Price</InputLabel>
                            <TextInput
                                className="w-full"
                                id="price"
                                required
                                placeholder="Price"
                                name="price"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="discount_price">Discount Price</InputLabel>
                            <TextInput
                                className="w-full"
                                id="discount_price"
                                required
                                placeholder="Discount Price"
                                name="discount_price"
                                value={data.discount_price}
                                onChange={(e) => setData("discount_price", e.target.value)}
                            />
                            <InputError message={errors.discount_price} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="coupon_code">Coupon Code</InputLabel>
                            <TextInput
                                type="text"
                                className="w-full"
                                id="coupon_code"
                                required={data.coupon_price !== ''}
                                placeholder="Coupon Code"
                                name="coupon_code"
                                value={data.coupon_code}
                                onChange={(e) => setData("coupon_code", e.target.value)}
                            />
                            <InputError message={errors.coupon_code} className="mt-2" />
                        </div>


                        <div className="">
                            <InputLabel htmlFor="coupon_price">Coupon Price</InputLabel>
                            <TextInput
                                type="number"
                                className="w-full"
                                id="coupon_price"
                                required={data.coupon_code !== ''}
                                placeholder="Coupon Price"
                                name="coupon_price"
                                value={data.coupon_price}
                                onChange={(e) => setData("coupon_price", e.target.value)}
                            />
                            <InputError message={errors.coupon_price} className="mt-2" />
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" name="status" checked={data.status} id="status" onChange={(e) => setData('status', e.target.checked)} />
                            <InputLabel htmlFor="status">Assign for display</InputLabel>
                        </div>

                        <div className="flex justify-between items-center">
                            <SecondaryButton onClick={() => setProdEditModal(!prodEditModal)}>
                                Close
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default ProductEditForm;
