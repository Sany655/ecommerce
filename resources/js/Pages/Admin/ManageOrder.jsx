import DangerButton from '@/Components/DangerButton';
import SelectInput from '@/Components/SelectInput';
import ProductCreateForm from '@/Forms/ProductCreateForm';
import ProductEditForm from '@/Forms/ProductEditForm';
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

            <div className="bg-white rounded py-12 mt-2">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Orders</h2>
                        </div>
                    </div>
                    {orders.data.length > 0 ? (
                        <>
                            <table className='min-w-full bg-white border border-gray-200 table-auto'>
                                <thead>
                                    <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                                        <th className='text-center p-5'>ID</th>
                                        <th className='py-3 px-6 text-center'>User Info</th>
                                        <th className='py-3 px-6 text-center'>Note</th>
                                        <th className='py-3 px-6 text-center'>Product Info</th>
                                        <th className='py-3 px-6 text-center'>Total Price</th>
                                        <th className='py-3 px-6 text-center'>Ordered Date</th>
                                        <th className='py-3 px-6 text-center'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.data.map((order, i) => (
                                            <OrderItems order={order} key={i} />
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-center">
                                {orders.links.map((link, index) => (
                                    <Link key={index} href={link.url} as="button" type="button" className={`px-4 py-2 mx-1 rounded border ${link.active ? 'bg-black text-white' : 'bg-white text-black'}`} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </>
                    ) : <p className="my-40 text-center">No Orders availabe</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const OrderItems = ({ order }) => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(order.status);

    const changeStatus = (orderId, status) => {
        setLoading(true)
        axios.put(route('home.order_status', orderId), { status })
            .then(res => {
                setStatus(res.data.status)
            })
            .catch(error => {
                alert(error.response.data.message)
                console.log(error.response.data);
            })
            .finally(() => setLoading(false));
    }

    return (<tr className='py-3 px-6 text-center border'>
        <td className=''>{order.id}</td>
        <td className='line-clamp-4'>{order.name} {order.email} {order.address} {order.division}</td>
        <td className=''>{order.notes}</td>
        <td className='line-clamp-3'>
            {order.order_items.map((item, j) => item.product.name + ' x ' + item.quantity + ', ')}
        </td>
        <td className=''>{order.total_price}</td>
        <td className=' line-clamp-2'>{new Date(order.created_at).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })}</td>
        <td className=''>
            {
                loading ? <i className="fa fa-spinner"></i> : (
                    <SelectInput value={status} onChange={e => changeStatus(order.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </SelectInput>
                )
            }
        </td>
    </tr>)
}

export default ManageOrder;
