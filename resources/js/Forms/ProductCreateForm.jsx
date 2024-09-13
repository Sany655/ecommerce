import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextArea from "@/Components/TextArea"
import TextInput from "@/Components/TextInput"
import { router, useForm } from "@inertiajs/react"
import { useState } from "react"

function ProductCreateForm({ categories = [], category = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: category,
        name: '',
        description: '',
        price: '',
        image: '',
        discount_price: '',
        coupon_price: '',
        coupon_code: '',
        status: false
    });
    const [prodCreateModal, setProdCreateModal] = useState(false)

    const handleCreateProduct = (e) => {
        e.preventDefault();
        if (!data.category_id) {
            alert('Please select a category for the product.');
            reset()
            router.get(route('category.index'));
        } else {
            post(route('product.store'), {
                forceFormData: true,
                onSuccess: () => { reset(); setProdCreateModal(false); },
                onError: e => console.log(e)
            });
        }
    };

    return (
        <>
            <PrimaryButton onClick={() => setProdCreateModal(true)}>Add Product</PrimaryButton>
            <Modal onClose={() => setProdCreateModal(!prodCreateModal)} show={prodCreateModal}>
                <div className="p-5">
                    <h3 className='mb-3 text-2xl font-bold flex justify-between items-center'>
                        <span>Create Product</span>
                        <i className="fa fa-close" onClick={() => setProdCreateModal(false)}></i>
                    </h3>
                    <form className='flex flex-col gap-5' onSubmit={handleCreateProduct} encType="multipart/form-data">
                        <div>
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
                            <InputLabel htmlFor="description">Product Description *</InputLabel>
                            <TextArea
                                className="w-full"
                                id="description"
                                required
                                name="description"
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            ></TextArea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

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
                            <InputLabel htmlFor="price">Price *</InputLabel>
                            <TextInput
                                required
                                className="w-full"
                                id="price"
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
                                className="w-full"
                                id="coupon_code"
                                placeholder="Coupon Code"
                                name="coupon_code"
                                required={data.coupon_price !== ''}
                                value={data.coupon_code}
                                onChange={(e) => setData("coupon_code", e.target.value)}
                            />
                            <InputError message={errors.coupon_code} className="mt-2" />
                        </div>


                        <div className="">
                            <InputLabel htmlFor="coupon_price">Coupon Price</InputLabel>
                            <TextInput
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
                            <SecondaryButton onClick={() => setProdCreateModal(!prodCreateModal)}>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Create</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
export default ProductCreateForm
