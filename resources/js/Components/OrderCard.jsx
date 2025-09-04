import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import SelectInput from '@/Components/SelectInput';
import { router } from '@inertiajs/react';

function OrderCard({ order, user }) {
    console.log(order);
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
    return (
        <div className={`p-6 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between ${order.status === 'pending' ? "bg-white" : (order.status === 'processing' ? "bg-yellow-500" : (order.status === 'completed' ? "bg-green-500" : order.status === 'hold' ? "bg-blue-300" : "bg-red-200"))}`}>
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
                                )} <br /> Subtotal: {parseInt(item.subtotal)} BDT
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-md text-gray-600 mb-2">
                    <strong>Total Price: </strong>{parseInt(order.total_price) + (order.division === "Dhaka" ? 80 : 150)} BDT
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
                {/* Order Notes Carousel */}
                {order?.order_notes?.length > 0 && (
                    <div className="text-md text-gray-600 mb-2">
                        <button
                            type="button"
                            className="font-bold underline text-gray-700 cursor-pointer mb-2"
                            onClick={() => setShowNotes((prev) => !prev)}
                        >
                            Order Notes {showNotes ? '▲' : '▼'}
                        </button>
                        {showNotes && (
                            <div className="mt-2 border rounded p-2 bg-gray-50">
                                <ul>
                                    {order?.order_notes?.map((note, index) => (
                                        <li key={index} className="mb-2">
                                            [
                                            {new Date(note.created_at).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                            ] {note.user.name} changed status to {note.status}
                                            <br />
                                            Note: {note.note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-4">
                    {loading ? (
                        <i className="fa fa-spinner animate-spin"></i>
                    ) : (
                        <SelectInput
                            value={order.status}
                            onChange={(e) => changeStatus(order.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="hold">On Hold</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </SelectInput>
                    )}
                </div>
            </div>
        </div>
    )
}
export default OrderCard