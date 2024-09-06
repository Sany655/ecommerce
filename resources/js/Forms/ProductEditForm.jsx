import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

function ProductEditForm({ product, categories }) {
    const [prodEditModal, setProdEditModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm();

    useEffect(() => {
        setData({
            _method: "PATCH",
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            image: null,
            price: product.price,
            quantity: product.quantity,
            discount: product.discount
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
                        <TextInput
                            required
                            placeholder="Name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />

                        <TextArea
                            required
                            name="description"
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                        ></TextArea>
                        <InputError message={errors.description} className="mt-2" />

                        <input
                            type="file"
                            name="image"
                            onChange={(e) => {
                                // Check if a file was selected
                                if (e.target.files.length > 0) {
                                    // Set the file to the form data
                                    setData('image', e.target.files[0]);
                                }
                            }}
                            accept="image/*"
                        />
                        <InputError message={errors.image} className="mt-2" />

                        {categories.length > 0 && (
                            <SelectInput
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
                        )}

                        <TextInput
                            required
                            placeholder="Price"
                            name="price"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                        />
                        <InputError message={errors.price} className="mt-2" />

                        <TextInput
                            required
                            placeholder="discount"
                            name="discount"
                            value={data.discount}
                            onChange={(e) => setData("discount", e.target.value)}
                        />
                        <InputError message={errors.discount} className="mt-2" />

                        <TextInput
                            required
                            placeholder="quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={(e) => setData("quantity", e.target.value)}
                        />
                        <InputError message={errors.quantity} className="mt-2" />

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
