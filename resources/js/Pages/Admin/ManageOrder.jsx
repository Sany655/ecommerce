import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

function ManageOrder(props) {
    const { orders } = props;

    return (
        <AuthenticatedLayout
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
                                <OrderCard key={i} order={order} />
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
        </AuthenticatedLayout>
    );
}

function OrderCard({ order }) {
    const [loading, setLoading] = useState(false);
    const changeStatus = (orderId, status) => {
        setLoading(true);
        axios.put(route('home.order_status', orderId), { status })
            .then(() => {
                router.reload(); // Reload to reflect the updated status
            })
            .catch(error => {
                alert(error.response.data.message);
                console.log(error.response.data);
            })
            .finally(() => setLoading(false));
    };
    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white flex flex-col justify-between">
            {/* Order Info */}
            <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Order ID: {order.id}</h3>
                <div className="text-md text-gray-600 mb-2">
                    <strong>User Info:</strong> <br />
                    <strong>Name: </strong> {order.name} <br />
                    <strong>Email: </strong> {order.email} <br />
                    <strong>Mobile: </strong> {order.mobile} <br />
                    <strong>Address: </strong> {order.address} <br />
                    <strong>Division: </strong> {order.division}
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Note: </strong>{order.notes || 'N/A'}
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Order Items: </strong>
                    <ul>
                        {order.order_items.map((item, j) => (
                            <li key={j}>
                                {j + 1}. {item.product?.name} x {item.quantity} <br />
                                {item.variants && (
                                    <span className="text-sm text-gray-500">
                                        Variants: {JSON.parse(item.variants).map((variant, k) => (
                                            <span key={k}>{variant.attribute}: {variant.value}, </span>
                                        ))}
                                    </span>
                                )} <br /> Subtotal: {item.subtotal} BDT
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Total Price: </strong>{order.total_price} BDT
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Coupon ID: </strong>{order.coupon_id || 'N/A'}
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Ordered Date: </strong>
                    {new Date(order.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Updated Date: </strong>
                    {new Date(order.updated_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </div>
            </div>

            {/* Status Update */}
            <div className="mt-4">
                {loading ? (
                    <i className="fa fa-spinner animate-spin"></i>
                ) : (
                    <SelectInput
                        value={order.status}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </SelectInput>
                )}
            </div>
        </div>
    )
}

export default ManageOrder;
