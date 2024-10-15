import DangerButton from '@/Components/DangerButton';
import CouponCreateForm from '@/Forms/CouponCreateForm';
import CouponEditForm from '@/Forms/CouponEditForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function ManageCoupon(props) {
    const { coupons } = props;

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Coupons</h2>}
        >
            <Head title="Manage Coupons" />

            <div className="py-12 mt-2 bg-white rounded">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-semibold">Coupons</h2>
                        <CouponCreateForm />
                    </div>
                    {coupons.data.length > 0 ? (
                        <>
                            <table className='min-w-full bg-white border border-gray-200'>
                                <thead>
                                    <tr className='text-sm leading-normal text-gray-600 uppercase bg-gray-200'>
                                        <th className='px-6 py-3 text-center'>Name</th>
                                        <th className='px-6 py-3 text-center'>Code</th>
                                        <th className='px-6 py-3 text-center'>Type</th>
                                        <th className='px-6 py-3 text-center'>Value</th>
                                        <th className='px-6 py-3 text-center'>Minimum Purchase</th>
                                        <th className='px-6 py-3 text-center'>Expiry Date</th>
                                        <th className='px-6 py-3 text-center'>Status</th>
                                        <th className='px-6 py-3 text-center'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        coupons.data.map((coupon, i) => (
                                            <CouponItems coupon={coupon} key={i} />
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="flex justify-center mt-4">
                                {coupons.links.map((link, index) => (
                                    <Link key={index} href={link.url} as="button" type="button" className={`px-4 py-2 mx-1 rounded border ${link.active ? 'bg-black text-white' : 'bg-white text-black'}`} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </>
                    ) : <p className="my-40 text-center">No Coupons availabe</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const CouponItems = ({ coupon }) => {

    const handleDeleteCoupon = (id) => {
        router.delete(`coupon/${id}`, { preserveScroll: true });
    }

    return (
        <tr className='px-6 py-3 text-center border-b'>
            <td className='border'>{coupon.name}</td>
            <td className='border'>{coupon.code}</td>
            <td className='border'>{coupon.type}</td>
            <td className='border'>{coupon.value} {coupon.type === 'fixed' ? <i className="fa-solid fa-bangladeshi-taka-sign"></i> : <i className="fa-solid fa-percentage"></i>}</td>
            <td className='border'>{coupon.minimum_purchase}</td>
            <td className='border'>{coupon.expiry_date}</td>
            <td className='border'>{coupon.status?<span className="bg-green-500 px-2 py-1">Active</span>:<span className="text-white bg-red-500 px-2 py-1">Inactive</span>}</td>
            <td className='flex items-center gap-2 p-4'>
                <CouponEditForm coupon={coupon} />
                <DangerButton onClick={() => handleDeleteCoupon(coupon.id)}>Delete</DangerButton>
            </td>
        </tr>
    )
}

export default ManageCoupon;
