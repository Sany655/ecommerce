import InputError from "@/Components/InputError"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextArea from "@/Components/TextArea"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

function ProductCreatForm({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: null,
        name: '',
        description: '',
        price: null,
        quantity: null,
        image: null,
        discount: null,
    });
    const [prodCreateModal, setProdCreateModal] = useState(false)

    const handleCreateProduct = (e) => {
        e.preventDefault();
        post(route('product.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setProdCreateModal(false); },
        });
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
                        <TextInput required placeholder="Name" name='name' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} className="mt-2" />
                        {categories.length > 0 && (
                            <>
                                <SelectInput name="category_id" onChange={(e) => setData('category_id', e.target.value)}>
                                    <option value="">Select Category</option>
                                    {
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </SelectInput>
                            </>
                        )}
                        <TextArea required name='description' placeholder="Description" value={data.description} onChange={(e) => setData('description', e.target.value)}></TextArea>
                        <InputError message={errors.description} className="mt-2" />
                        <input type="file" name="image" required id="image" onChange={(e) => setData('image', e.target.files[0])} accept="image/*" />
                        <InputError message={errors.image} className="mt-2" />
                        <TextInput type="number" min="0" required placeholder="Price" name='price' value={data.price} onChange={(e) => setData('price', e.target.value)} />
                        <InputError message={errors.price} className="mt-2" />
                        <TextInput type="number" min="0" required placeholder="Discount" name='discount' value={data.discount} onChange={(e) => setData('discount', e.target.value)} />
                        <InputError message={errors.discount} className="mt-2" />
                        <TextInput type="number" min="1" required placeholder="Quantity" name='quantity' value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                        <InputError message={errors.quantity} className="mt-2" />
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
export default ProductCreatForm
