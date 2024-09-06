import PrimaryButton from "@/Components/PrimaryButton"

function ProductCreateForm() {
    return (
        <>
            <PrimaryButton onClick={() => setProdCreateModal(true)}>Add Product/Subcategory</PrimaryButton>
            <Modal onClose={() => setProdCreateModal(!prodCreateModal)} show={prodCreateModal}>
                <div className="p-5">
                    <h3 className='mb-3 text-2xl font-bold flex justify-between items-center'>
                        <span>Create Product</span>
                        <i className="fa fa-close" onClick={() => setProdCreateModal(false)}></i>
                    </h3>
                    {/* <form className='flex flex-col gap-5' onSubmit={handleCreateCategory} encType="multipart/form-data">
                        <TextInput required placeholder="Name" name='name' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} className="mt-2" />
                        <TextArea required name='description' placeholder="Description" value={data.description} onChange={(e) => setData('description', e.target.value)}></TextArea>
                        <InputError message={errors.description} className="mt-2" />
                        <input type="file" name="banner" required id="banner" onChange={(e) => setData('banner', e.target.files[0])} accept="image/*" />
                        <InputError message={errors.banner} className="mt-2" />
                        {categories.length > 0 && (
                            <>
                                <SelectInput name="parent_id">
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
                            <SecondaryButton>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Create</PrimaryButton>
                        </div>
                    </form> */}
                </div>
            </Modal>
        </>
    )
}
export default ProductCreateForm
