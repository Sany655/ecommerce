import ApplicationLogo from '@/Components/ApplicationLogo';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function OrderInvoice({ order,app_url }) {
    const invoiceRef = useRef(null)

    const downloadInvoice = async () => {
        var opt = {
            margin: 1,
            filename: `hamdaanz-order-invoice.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(invoiceRef.current).set(opt).save();
    }

    return (
        <AppLayout>
            <Head title='Invoice' />
            <div className="max-w-xl p-8 mx-auto my-8 bg-white rounded-lg shadow-lg" id="print-area" ref={invoiceRef}>
                <div className="text-center w-full mb-5">
                    <ApplicationLogo className={"w-1/2 mx-auto mb-5"} />
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
                                <th>ID</th>
                                <th className="py-2">Product</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.order_items.map((item, index) => (
                                <tr key={index} className="text-sm border-b">
                                    <td>{item.id}</td>
                                    <td className="py-2 line-clamp-5">{item.product.name}</td>
                                    <td className="py-2">{item.quantity}</td>
                                    <td className="py-2">{item.product?.discount_price || item.product?.price} <i className="fa-solid fa-bangladeshi-taka-sign"></i></td>
                                    <td className="py-2">{item.subtotal} <i className="fa-solid fa-bangladeshi-taka-sign"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <a className='underline text-blue-500 hover:text-blue-600' href={app_url + "/order-invoice/" + order.order_token}>Track your order</a>
                </div>

                {/* Payment Info */}
                <div className="pb-4 mb-4 border-b">
                    <h3 className="mb-2 text-lg font-semibold">Payment Summary</h3>
                    <div className="flex justify-between text-sm">
                        <p><strong>Subtotal:</strong></p>
                        <p>{order.total_price} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
                    </div>
                    {(order.coupon || order.order_items.some(oI => oI.coupon)) && <div className="flex justify-between text-sm">
                        <p><strong>Coupon:</strong></p>
                        <p>{order.coupon?.value} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
                    </div>}
                    <div className="flex justify-between text-sm">
                        <p><strong>Shipping Cost:</strong></p>
                        <p>{order.division === "Chittagong" ? 100 : 150} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
                    </div>
                    <div className="flex justify-between text-sm">
                        <p><strong>Total:</strong></p>
                        <p>{parseInt(order.total_price)} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
                    </div>
                    <div className="flex justify-between text-sm">
                        <p><strong>Payment Method:</strong></p>
                        <p>{order.payment_method}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                        <p><strong>Payment Status:</strong></p>
                        <p>{order.payment_status}</p>
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
