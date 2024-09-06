import InputError from "@/Components/InputError";
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

    useEffect(() => {
        setData({
            _method: "PATCH",
            name: category.name,
            description: category.description,
            parent_id: category.parent_id,
            banner: null, // Explicitly set banner to null initially
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
                    <h3 className="mb-3 text-2xl font-bold flex justify-between items-center">
                        <span>Edit Category</span>
                        <i className="fa fa-close" onClick={() => setCatEditModal(false)}></i>
                    </h3>
                    <form className="flex flex-col gap-5" onSubmit={UpdateCategory} encType="multipart/form-data">
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
                            name="banner"
                            onChange={(e) => {
                                // Check if a file was selected
                                if (e.target.files.length > 0) {
                                    // Set the file to the form data
                                    setData('banner', e.target.files[0]);
                                }
                            }}
                            accept="image/*"
                        />
                        <InputError message={errors.banner} className="mt-2" />

                        {categories.length > 0 && (
                            <SelectInput
                                name="parent_id"
                                value={data.parent_id || ""} // Set value for parent_id
                                onChange={(e) => setData("parent_id", e.target.value)}
                            >
                                <option value={""}>Select Category to use it as subcategory</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </SelectInput>
                        )}

                        <div className="flex justify-between items-center">
                            <SecondaryButton onClick={() => setCatEditModal(!catEditModal)}>
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

export default CategoryEditForm;
