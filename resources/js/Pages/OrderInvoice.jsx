import useCart from '@/Hooks/useCart';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
// import html2pdf from 'html2pdf.js';

function Index({ order }) {
    const invoiceRef = useRef(null)
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [])

    const downloadInvoice = async () => {
        try {
            const response = await axios.get(route('home.download_invoice', { orderId: order.id }), {
                responseType: 'blob',  // Important to handle binary data
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'order_invoice.pdf');  // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF:', error.message);
        }
    }

    return (
        <div className="max-w-md mx-auto my-8 p-8 bg-white shadow-lg rounded-lg" ref={invoiceRef}>
            <h2 className="text-2xl font-bold text-center mb-8">Order Invoice</h2>

            {/* User Info */}
            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}, {order.city}, {order.division}</p>
            </div>

            {/* Product Info */}
            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <table className="min-w-full text-left table-auto">
                    <thead>
                        <tr className="border-b text-sm font-semibold text-gray-700">
                            <th className="py-2">Product</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((item, index) => (
                            <tr key={index} className="border-b text-sm">
                                <td className="py-2">{item.product.name}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {item.price}</td>
                                <td className="py-2"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Info */}
            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
                <div className="flex justify-between text-sm">
                    <p><strong>Subtotal:</strong></p>
                    <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {order.total_price}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <p><strong>Tax (5%):</strong></p>
                    <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {(order.total_price * 0.05).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <p><strong>Total:</strong></p>
                    <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {(order.total_price * 1.05).toFixed(2)}</p>
                </div>
            </div>

            {/* Order Info */}
            <div className="pb-4">
                <h3 className="text-lg font-semibold mb-2">Order Info</h3>
                <div className="flex justify-between text-sm">
                    <p><strong>Order Date:</strong></p>
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                {/* <div className="flex justify-between text-sm">
                    <p><strong>Status:</strong></p>
                    <p>{order.status}</p>
                </div> */}
            </div>

            {/* Print Button */}
            <div className="mt-6 text-center" data-html2canvas-ignore>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    // onClick={() => window.print()}
                    onClick={downloadInvoice}
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
}

function OrderInvoice({ order }) {
    return (
        <AppLayout>
            <Head title='Invoice' />
            <Index order={order} />
        </AppLayout>
    )
}

export default OrderInvoice;
