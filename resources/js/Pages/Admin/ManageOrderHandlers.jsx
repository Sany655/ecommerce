import HandlerCreateForm from '@/Forms/HandlerCreateForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { parse } from 'postcss';
import { useEffect, useState } from 'react';

function ManageOrderHandlers(props) {
    const { orderHandler } = props;
    useEffect(() => {
        // Any side effects or data fetching can go here
        console.log(orderHandler);

    }, []);
    return (
        <AdminLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order Handlers</h2>}
        >
            <Head title="Manage Order Handlers" />

            <div className="bg-white rounded py-12 mt-2 px-2">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Order Handlers</h2>
                        <HandlerCreateForm />
                    </div>

                    {/* make a table for order handlers */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orderHandler.map((handler) => (
                                <tr key={handler.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {handler.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {handler.email}
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <Link href={`/order-handlers/${handler.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </Link>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {/* <div className="mt-4 flex justify-center">
                        {orderHandler.links.map((link, index) => (
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
                    </div> */}
                </div>
            </div>
        </AdminLayout>
    );
}

// function OrderCard({ order }) {
//     const [loading, setLoading] = useState(false);
//     const changeStatus = (orderId, status) => {
//         setLoading(true);
//         axios.put(route('home.order_status', orderId), { status })
//             .then(() => {
//                 router.reload(); // Reload to reflect the updated status
//             })
//             .catch(error => {
//                 alert(error.response.data.message);
//                 console.log(error.response.data);
//             })
//             .finally(() => setLoading(false));
//     };
//     return (
//         <div className={`p-6 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between ${order.status === 'pending' ? "bg-white" : (order.status === 'processing' ? "bg-yellow-500" : (order.status === 'completed' ? "bg-green-500" : "bg-red-200"))}`}>
//             {/* Order Info */}
//             <div className="mb-4">
//                 <h3 className="text-lg font-bold mb-2">Order ID: {order.id}</h3>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>User Info:</strong> <br />
//                     <strong>Name: </strong> {order.name} <br />
//                     <strong>Email: </strong> {order.email} <br />
//                     <strong>Mobile: </strong> {order.mobile} <br />
//                     <strong>Address: </strong> {order.address} <br />
//                     <strong>Division: </strong> {order.division}
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Note: </strong>{order.notes || 'N/A'}
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Order Items: </strong>
//                     <ul>
//                         {order.order_items.map((item, j) => (
//                             <li key={j}>
//                                 {j + 1}. {item.product?.name} x {item.quantity} <br />
//                                 {item.variants && (
//                                     <span className="text-sm text-gray-500">
//                                         Variants: {JSON.parse(item.variants).map((variant, k) => (
//                                             <span key={k}>{variant.attribute}: {variant.value}, </span>
//                                         ))}
//                                     </span>
//                                 )} <br /> Subtotal: {parseInt(item.subtotal)} BDT
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Total Price: </strong>{parseInt(order.total_price) + (order.division === "Dhaka" ? 80 : 150)} BDT
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Coupon ID: </strong>{order.coupon_id || 'N/A'}
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Ordered Date: </strong>
//                     {new Date(order.created_at).toLocaleString('en-GB', {
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         hour12: true,
//                     })}
//                 </div>
//                 <div className="text-md text-gray-600 mb-2">
//                     <strong>Updated Date: </strong>
//                     {new Date(order.updated_at).toLocaleString('en-GB', {
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         hour12: true,
//                     })}
//                 </div>
//             </div>

//             {/* Status Update */}
//             <div className="mt-4">
//                 {loading ? (
//                     <i className="fa fa-spinner animate-spin"></i>
//                 ) : (
//                     <SelectInput
//                         value={order.status}
//                         onChange={(e) => changeStatus(order.id, e.target.value)}
//                     >
//                         <option value="pending">Pending</option>
//                         <option value="processing">Processing</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                     </SelectInput>
//                 )}
//             </div>
//         </div>
//     )
// }

export default ManageOrderHandlers;
