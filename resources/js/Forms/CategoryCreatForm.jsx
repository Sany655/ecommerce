import InputError from "@/Components/InputError"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextArea from "@/Components/TextArea"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

function CategoryCreatForm({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        banner: null,
        parent_id: null,
    });
    const [catCreateModal, setCatCreateModal] = useState(false)

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
                    <form className='flex flex-col gap-5' onSubmit={handleCreateCategory} encType="multipart/form-data">
                        <TextInput required placeholder="Name" name='name' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} className="mt-2" />
                        <TextArea required name='description' placeholder="Description" value={data.description} onChange={(e) => setData('description', e.target.value)}></TextArea>
                        <InputError message={errors.description} className="mt-2" />
                        <input type="file" name="banner" required id="banner" onChange={(e) => setData('banner', e.target.files[0])} accept="image/*" />
                        <InputError message={errors.banner} className="mt-2" />
                        {categories.length > 0 && (
                            <>
                                <SelectInput name="parent_id" onChange={(e) => setData('parent_id',e.target.value)}>
                                    <option value="">Select Category to use it as subcategory</option>
                                    {
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </SelectInput>
                            </>
                        )}
                        <div className="flex justify-between items-center">
                            <SecondaryButton onClick={() => setCatCreateModal(!catCreateModal)}>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Create</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
export default CategoryCreatForm
