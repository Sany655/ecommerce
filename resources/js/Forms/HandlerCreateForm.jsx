import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

function HandlerCreateForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });
    const [handlerCreateModal, setHandlerCreateModal] = useState(false)

    const handleCreateHandler = (e) => {
        e.preventDefault();
        post(route('order-handler.store'), {
            onSuccess: () => {
                reset();
                setHandlerCreateModal(false);
            }
        });
    }

    return (
        <div>
            <PrimaryButton onClick={() => setHandlerCreateModal(true)}>Add Handler</PrimaryButton>
            <Modal onClose={() => setHandlerCreateModal(!handlerCreateModal)} show={handlerCreateModal}>
                <div className="p-5">
                    <h3 className='mb-3 text-2xl font-bold flex justify-between items-center'>
                        <span>Create Handler</span>
                        <i className="fa fa-close cursor-pointer" onClick={() => setHandlerCreateModal(false)}></i>
                    </h3>
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={handleCreateHandler}
                        encType="multipart/form-data"
                    >
                        {/* Name Input */}
                        <div>
                            <InputLabel htmlFor="name">Handler Name</InputLabel>
                            <TextInput
                                required
                                id="name"
                                name="name"
                                placeholder="Enter handler name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.name} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Email Input */}
                        <div>
                            <InputLabel htmlFor="email">Handler Email</InputLabel>
                            <TextInput
                                required
                                id="email"
                                name="email"
                                placeholder="Enter handler email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.email} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <InputLabel htmlFor="password">Handler Password</InputLabel>
                            <TextInput
                                required
                                id="password"
                                name="password"
                                placeholder="Enter handler password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                            />
                            <InputError message={errors.password} className="mt-2 text-red-500 text-sm" />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-4">
                            <SecondaryButton
                                type="button"
                                onClick={() => setHandlerCreateModal(!handlerCreateModal)}
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
        </div>
    )
}

export default HandlerCreateForm