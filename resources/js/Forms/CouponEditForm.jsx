import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

function CouponEditForm({ coupon }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: coupon.name,
        code: coupon.code,
        value: coupon.value,
        type: coupon.type,
        expiry_date: coupon.expiry_date || '',
        minimum_purchase: coupon.minimum_purchase || '',
        status: coupon.status
    });
    const [couponEditModal, setCouponEditModal] = useState(false)

    const handleEditCoupon = (e) => {
        e.preventDefault();
        patch(route("coupon.update", coupon.id), {
            onSuccess: () => {
                setCouponEditModal(false);
            },
            preserveScroll: true
        });
    };

    return (
        <>
            <PrimaryButton onClick={() => setCouponEditModal(true)}>Edit Coupon</PrimaryButton>
            <Modal onClose={() => setCouponEditModal(!couponEditModal)} show={couponEditModal}>
                <div className="p-5">
                    <h3 className='flex items-center justify-between mb-3 text-2xl font-bold'>
                        <span>Edit Coupon</span>
                        <i className="fa fa-close cursor-pointer" onClick={() => setCouponEditModal(false)}></i>
                    </h3>
                    <form className='flex flex-col gap-5' onSubmit={handleEditCoupon}>
                        <div>
                            <InputLabel htmlFor="name">Coupon Name*</InputLabel>
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
                            <InputLabel htmlFor="code">Coupon Code *</InputLabel>
                            <TextInput
                                className="w-full"
                                id="code"
                                placeholder="Coupon Code"
                                name="code"
                                required
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="type">Select Type*</InputLabel>
                            <SelectInput
                                required
                                className="w-full"
                                id="type"
                                name="type"
                                value={data.type}
                                onChange={(e) => setData("type", e.target.value)}>
                                <option value="">Select Type</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="percentage">Percentage</option>
                            </SelectInput>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="value">Value (price amount/percentage) *</InputLabel>
                            <TextInput
                                required
                                className="w-full"
                                id="value"
                                placeholder="value or percentage"
                                name="value"
                                value={data.value}
                                onChange={(e) => setData("value", e.target.value)}
                                type="number"
                            />
                            <InputError message={errors.value} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="minimum_purchase">Minimum Purchase</InputLabel>
                            <TextInput
                                className="w-full"
                                id="minimum_purchase"
                                placeholder="minimum purchase"
                                name="minimum_purchase"
                                value={data.minimum_purchase}
                                onChange={(e) => setData("minimum_purchase", e.target.value)}
                                type="number"
                            />
                            <small className="text-blue-400">Coupon will be applicable with minimum amount of purchase</small>
                            <InputError message={errors.minimum_purchase} className="mt-2" />
                        </div>

                        <div className="">
                            <InputLabel htmlFor="expiry_date">Expiry Date</InputLabel>
                            <TextInput
                                className="w-full"
                                id="expiry_date"
                                placeholder="value or percentage"
                                name="expiry_date"
                                value={data.expiry_date}
                                onChange={(e) => setData("expiry_date", e.target.value)}
                                type="date"
                            />
                            <small className="text-blue-400">After this date coupon won't work!</small>
                            <InputError message={errors.expiry_date} className="mt-2" />
                        </div>

                        {/* Status Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                defaultChecked={coupon.status}
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <InputLabel htmlFor="status" className="text-sm text-gray-700">Assign for display</InputLabel>
                        </div>

                        <div className="flex items-center justify-between">
                            <SecondaryButton onClick={() => setCouponEditModal(!couponEditModal)}>Close</SecondaryButton>
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
export default CouponEditForm
