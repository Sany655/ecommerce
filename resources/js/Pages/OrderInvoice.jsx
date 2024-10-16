import useCart from '@/Hooks/useCart';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
// import html2pdf from 'html2pdf.js';

function OrderInvoice({ order }) {
    const invoiceRef = useRef(null)

    const downloadInvoice = async () => {
        window.print()
        // try {
        //     const response = await axios.get(route('home.download_invoice', { orderId: order.id }), {
        //         responseType: 'blob',  // Important to handle binary data
        //     });
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'order_invoice.pdf');  // Set the file name
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
        // } catch (error) {
        //     console.error('Error downloading PDF:', error.response.data);
        // }
    }

    return (
        <AppLayout>
            <Head title='Invoice' />
            <style>{`
                @media print {
                

                #print-area {
                    position: fixed;
                    left: 0;
                    top: 0;
                    margin:auto
                    width: 100vw;
                    height: 100vh;
                }
                body * {
                    visibility: hidden;
                }

                #print-area, #print-area * {
                    visibility: visible;
                }
                }
        `}</style>
            <div className="max-w-xl p-8 mx-auto my-8 bg-white rounded-lg shadow-lg" id="print-area" ref={invoiceRef}>
                <div className="text-center w-full mb-5">
                    <img src="/images/logo.png" alt="" className="w-1/2 mx-auto" />
                    <hr />
                </div>
                <h2 className="mb-8 text-xl font-bold text-center">Order Invoice</h2>

                {/* User Info */}
                <div className="pb-4 mb-4 border-b">
                    <h3 className="mb-2 text-lg font-semibold">Customer Info</h3>
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Address:</strong> {order.address}, {order.city}, {order.division}</p>
                </div>

                {/* Product Info */}
                <div className="pb-4 mb-4 border-b">
                    <h3 className="mb-2 text-lg font-semibold">Order Details</h3>
                    <table className="min-w-full text-left table-auto">
                        <thead>
                            <tr className="text-sm font-semibold text-gray-700 border-b">
                                <th className="py-2">Product</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.order_items.map((item, index) => (
                                <tr key={index} className="text-sm border-b">
                                    <td className="py-2 line-clamp-5">{item.product.name}</td>
                                    <td className="py-2">{item.quantity}</td>
                                    <td className="py-2 flex gap-2"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {item.product.discount_price || item.product.price}</td>
                                    <td className="py-2 flex gap-2"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {item.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment Info */}
                <div className="pb-4 mb-4 border-b">
                    <h3 className="mb-2 text-lg font-semibold">Payment Summary</h3>
                    <div className="flex justify-between text-sm">
                        <p><strong>Subtotal:</strong></p>
                        <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {order.total_price}</p>
                    </div>
                    {(order.coupon || order.order_items.some(oI => oI.coupon)) && <div className="flex justify-between text-sm">
                        <p><strong>Coupon:</strong></p>
                        <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {order.coupon?.value}</p>
                    </div>}
                    <div className="flex justify-between text-sm">
                        <p><strong>Shipping Cost:</strong></p>
                        <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {order.division === "Chittagong" ? 100 : 150}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                        <p><strong>Total:</strong></p>
                        <p><i className="fa-solid fa-bangladeshi-taka-sign"></i> {parseInt(order.total_price)}</p>
                    </div>
                </div>

                {/* Order Info */}
                <div className="pb-4">
                    <h3 className="mb-2 text-lg font-semibold">Order Info</h3>
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
                        className="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-700"
                        // onClick={() => window.print()}
                        onClick={downloadInvoice}
                    >
                        Print Invoice
                    </button>
                </div>
            </div>

        </AppLayout>

    );
}

// function OrderInvoice({ order }) {
//     return (

//     )
// }

export default OrderInvoice;
