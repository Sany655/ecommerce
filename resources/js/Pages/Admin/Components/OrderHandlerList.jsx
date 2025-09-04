import React from 'react'
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';

function OrderHandlerList({ handler }) {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <tr key={handler.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {handler.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {handler.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {handler.order_notes.length === 0 ? (
                    <p>No order history available.</p>
                ) : (
                    <>
                        <button onClick={() => setShowHistory(!showHistory)}>
                            {showHistory ? 'Hide History' : 'Show History'}
                        </button>
                        <Modal show={showHistory} onClose={() => setShowHistory(!showHistory)}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Order History for {handler.name}</h2>
                                <button className="text-red-500 hover:underline" onClick={() => setShowHistory(false)}>X</button>
                            </div>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-2">
                                    <div className="p-6">
                                        <div className="overflow-x-auto">
                                            <table className="w-full border border-gray-200 rounded-lg shadow-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Customer</th>
                                                        <th className="px-4 py-2 text-left">Mobile</th>
                                                        <th className="px-4 py-2 text-left">Total</th>
                                                        <th className="px-4 py-2 text-left">Status</th>
                                                        <th className="px-4 py-2 text-left">Note</th>
                                                        <th className="px-4 py-2 text-left">Created At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        handler.order_notes.map((note) => (
                                                            <tr key={note.id} className="border-t hover:bg-gray-50">
                                                                <td className="px-4 py-2">{note.order.name}</td>
                                                                <td className="px-4 py-2">{note.order.mobile}</td>
                                                                <td className="px-4 py-2 font-medium">৳ {note.order.total_price}</td>
                                                                <td
                                                                    className={`px-4 py-2 font-semibold ${note.status === "confirm"
                                                                        ? "text-green-600"
                                                                        : note.order.status === "inprogress"
                                                                            ? "text-yellow-600"
                                                                            : note.order.status === "cancelled"
                                                                                ? "text-red-600"
                                                                                : "text-gray-600"
                                                                        }`}
                                                                >
                                                                    {note.status}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                    {note.note}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                                    {new Date(note.created_at).toLocaleString()}
                                                                </td>
                                                            </tr>

                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowHistory(false)} className='bg-red-600 text-white hover:bg-red-900 m-2 p-2 rounded ms-auto'>Close</button>
                        </Modal>
                    </>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link
                    href={route('order-handler.destroy', handler.id)}
                    method="delete"
                    as="button"
                    className="text-blue-600 hover:text-blue-900"
                >
                    Delete
                </Link>
            </td>
        </tr>
    )
}

export default OrderHandlerList