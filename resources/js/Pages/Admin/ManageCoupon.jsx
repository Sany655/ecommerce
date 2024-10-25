import DangerButton from '@/Components/DangerButton';
import CouponCreateForm from '@/Forms/CouponCreateForm';
import CouponEditForm from '@/Forms/CouponEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function ManageCoupon(props) {
    const { coupons } = props;
    const handleDeleteCoupon = (id) => {
        router.delete(`coupon/${id}`, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Coupons</h2>}
        >
            <Head title="Manage Coupons" />

            <div className="py-12 mt-2 bg-white rounded p-2">
                <div className="container mx-auto overflow-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-semibold">Coupons</h2>
                        <CouponCreateForm />
                    </div>

                    {coupons.data.length > 0 ? (
                        <>
                            {/* Card Layout for Coupons */}
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {coupons.data.map((coupon, i) => (
                                    <div
                                        key={i}
                                        className="p-4 border border-gray-200 rounded-lg shadow-md bg-white flex flex-col justify-between"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold mb-2">{coupon.name}</h3>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Code: </strong>{coupon.code}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Type: </strong>{coupon.type}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Value: </strong>
                                                {coupon.value} {coupon.type === 'fixed' ? (
                                                    <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                                                ) : (
                                                    <i className="fa-solid fa-percentage"></i>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Min Purchase: </strong>{coupon.minimum_purchase}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Expiry: </strong>{coupon.expiry_date}
                                            </div>
                                            <div className="text-sm mb-2">
                                                <strong>Status: </strong>
                                                {coupon.status ? (
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded">Active</span>
                                                ) : (
                                                    <span className="bg-red-500 text-white px-2 py-1 rounded">Inactive</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Edit/Delete Buttons */}
                                        <div className="flex justify-between items-center">
                                            <CouponEditForm coupon={coupon} />
                                            <DangerButton onClick={() => handleDeleteCoupon(coupon.id)}>
                                                Delete
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Links */}
                            <div className="flex justify-center mt-4">
                                {coupons.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        as="button"
                                        type="button"
                                        className={`px-4 py-2 mx-1 rounded border ${link.active ? 'bg-black text-white' : 'bg-white text-black'}`}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="my-40 text-center">No Coupons available</p>
                    )}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

export default ManageCoupon;
