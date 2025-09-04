import OrderCard from '@/Components/OrderCard';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

function ManageOrder(props) {
    const { orders } = props;

    return (
        <AdminLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}
        >
            <Head title="Manage Orders" />

            <div className="bg-white rounded py-12 mt-2 px-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Orders</h2>
                        </div>
                    </div>

                    {orders.data.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {orders.data.map((order, i) => (
                                <OrderCard key={i} order={order} user={props.auth.user} />
                            ))}
                        </div>
                    ) : (
                        <p className="my-40 text-center">No Orders available</p>
                    )}

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center">
                        {orders.links.map((link, index) => (
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
                </div>
            </div>
        </AdminLayout>
    );
}



export default ManageOrder;
