import React, { useEffect } from 'react'
import axios from 'axios';
import { useState } from 'react';
import SelectInput from '@/Components/SelectInput';
import { router } from '@inertiajs/react';
import Modal from './Modal';

function OrderCard({ order, user }) {
    const [showNotes, setShowNotes] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeStatus = (orderId, status) => {
        setLoading(true);
        const note = prompt("Please provide a reason for changing the order status:");
        axios.post(route('home.order_status'), { orderId, status, note, user: user.id })
            .then(() => {
                router.reload();
            })
            .catch(error => {
                console.log(error.response.data);
                alert(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };

    const deleteOrder = (orderId) => {
        if (confirm("Are you sure you want to delete this order?")) {
            axios.post(route('home.delete_order'), { orderId })
                .then(() => {
                    router.reload();
                })
                .catch(error => {
                    console.log(error.response.data);
                    alert(error.response.data.message);
                });
        }
    };

    return (
        <tr className={"text-center border-b" + (order.status === 'confirm' ? " bg-white hover:bg-gray-100" : (order.status === 'pending' ? " bg-yellow-100 hover:bg-yellow-200" : (order.status === 'followup' ? " bg-green-100 hover:bg-green-200" : order.status === 'inprogress' ? " bg-blue-100 hover:bg-blue-200" : order.status === 'fake_order' ? " bg-red-100 hover:bg-red-200" : order.status === 'exchange' ? " bg-purple-100 hover:bg-purple-200" : order.status === 'delivered' ? " bg-teal-100 hover:bg-teal-200" : order.status === 'cancelled' ? " bg-orange-100 hover:bg-orange-200" : order.status === 'cx_busy' ? " bg-pink-100 hover:bg-pink-200" : " bg-gray-100 hover:bg-gray-200")))}>
            <td className="px-4 py-2 border">{order.id}</td>
            <td className="px-4 py-2 border text-left">{order.name} <br /> {order.mobile} <br /> {order.address}</td>
            <td className="px-4 py-2 border text-left">
                <ul>
                    {order.order_items.map((item, j) => (
                        <li key={j}>
                            {j + 1}. {item.product?.name} x {item.quantity},
                            {item.variants && item.variants.length > 0 && (
                                <span className="text-sm text-gray-500">
                                    {JSON.parse(item.variants).map((variant, k) => (
                                        <span key={k}> {variant.attribute}: {variant.values},</span>
                                    ))}
                                </span>
                            )} {parseInt(item.subtotal)} BDT
                        </li>
                    ))}
                </ul>
            </td>
            <td className="px-4 py-2 border">
                {loading ? (
                    <i className="fa fa-spinner animate-spin"></i>
                ) : (
                    <SelectInput
                        value={order.status}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                    >
                        <option value="confirm">Confirm</option>
                        <option value="pending">Pending</option>
                        <option value="followup">Follow Up</option>
                        <option value="inprogress">In Progress</option>
                        <option value="fake_order">Fake Order</option>
                        <option value="exchange">Exchange</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="cx_busy">Cx Busy</option>
                        <option value="phone_off">Phone Off</option>
                    </SelectInput>
                )}
            </td>
            <td className="px-4 py-2 border text-left">
                {order?.order_notes.length > 0 ? order?.order_notes?.length > 0 && (
                    <div className="text-md text-gray-600 mt-2">
                        <button type="button" className="underline" onClick={() => setShowNotes(!showNotes)}>
                            {showNotes ? "Hide Notes" : "Show Notes"}
                        </button>
                        <Modal show={showNotes} maxWidth="md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Order Notes</h2>
                                <button className="text-red-500 hover:underline" onClick={() => setShowNotes(false)}>X</button>
                            </div>
                            <ul className="list-disc list-inside">
                                {order?.order_notes?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((note, index) => (
                                    <li key={index} className="mb-2"><span className="font-bold">[{new Date(note.created_at).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}]</span> <span className="text-blue-500">{note.user?.name}</span> changed status to <span className="font-semibold">{note.status}</span>.
                                        <br />
                                        <span className="text-blue-500">Note: {note.note}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="text-red-500 hover:underline" onClick={() => setShowNotes(false)}>Close</button>
                        </Modal>
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td className="px-4 py-2 border">{new Date(order.created_at).toLocaleDateString('en-UK')}</td>
            <td className="px-4 py-2 border">{order.total_price}</td>
            <td className="px-4 py-2 border">
                <button type="button" className="text-red-500 hover:underline" onClick={() => deleteOrder(order.id)}>
                    Delete
                </button>
            </td>
        </tr>
    )
}
export default OrderCard