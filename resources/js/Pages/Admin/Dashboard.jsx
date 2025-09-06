import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
export default function Dashboard(props) {
    const data = props;
    const chartData = data.samples.map((s, i) => ({
        division: s[0],
        priceBucket: s[1],
        status: data.labels[i],
    }));

    return (
        <AdminLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen">
                <div className="container mx-auto">
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="shadow-lg rounded-2xl p-4 bg-white">
                            <div>
                                <h2 className="text-lg font-semibold">Orders</h2>
                                <p>Total: {data.orders.total}</p>
                                <p>Pending: {data.orders.pending}</p>
                                <p>Delivered: {data.orders.delivered}</p>
                                <p>Cancelled: {data.orders.cancelled}</p>
                            </div>
                        </div>
                        <div className="shadow-lg rounded-2xl p-4 bg-white">
                            <div>
                                <h2 className="text-lg font-semibold">Revenue</h2>
                                <p>Total: ৳{data.revenue.total}</p>
                                <p>Today: ৳{data.revenue.today}</p>
                                <p>This Month: ৳{data.revenue.month}</p>
                            </div>
                        </div>
                        <div className="shadow-lg rounded-2xl p-4 bg-white">
                            <div>
                                <h2 className="text-lg font-semibold">Customers</h2>
                                <p>Total: {data.customers.total}</p>
                                <p>New This Month: {data.customers.newThisMonth}</p>
                            </div>
                        </div>
                    </div> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-8 0 4 4 0 008 0zm6 2a4 4 0 10-8 0 4 4 0 008 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Customers</h2>
                                <p>Total: {data.customers.total}</p>
                                <p>New This Month: {data.customers.newThisMonth}</p>
                            </div>
                            {/* <div className="text-sm font-medium text-gray-500">Total Users</div> */}
                            {/* <div className="mt-1 text-3xl font-bold text-gray-900">{data.users}</div> */}
                        </div>
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                                </svg>
                            </div>
                            {/* <div className="text-sm font-medium text-gray-500">Orders Today</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">{props.orders}</div> */}
                            <div>
                                <h2 className="text-lg font-semibold">Orders</h2>
                                <p>Total: {data.orders.total}</p>
                                <p>Pending: {data.orders.pending}</p>
                                <p>Delivered: {data.orders.delivered}</p>
                                <p>Cancelled: {data.orders.cancelled}</p>
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Revenue</h2>
                                <p>Total: ৳{data.revenue.total}</p>
                                <p>Today: ৳{data.revenue.today}</p>
                                <p>This Month: ৳{data.revenue.month}</p>
                            </div>
                            {/* <div className="text-sm font-medium text-gray-500">Revenue</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">{parseInt(props.revenue)} BDT</div> */}
                        </div>
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8zm6 6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a6 6 0 0112 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Top 3 Products</h2>
                                <ul>
                                    {data.topProducts.map((product, index) => (
                                        <li key={index} className="text-gray-700">* {product.name}</li>
                                    ))}
                                </ul>
                            </div>
                            {/* <div className="text-sm font-medium text-gray-500">Top</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">{props.pending_shipments}</div> */}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white shadow-sm p-5">
                            <h1 className='text-lg font-semibold text-center'>Chart of Orders by Division and Price Range</h1>
                            <BarChart width={500} height={300} data={chartData}>
                                <XAxis dataKey="division" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="priceBucket" fill="#8884d8" />
                            </BarChart>
                            <p>The chart shows how orders are distributed across divisions and price ranges, helping you see where most orders fall.</p>
                        </div>
                        <div className="bg-white shadow-sm p-5">
                            <h1 className='text-lg font-semibold text-center'>Chart of Orders by Address Length and Status</h1>
                            <BarChart width={500} height={300} data={data.chartData}>
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="addressLength" fill="#82ca9d" />
                            </BarChart>
                            <p>The chart uses address length vs status, showing whether shorter or longer addresses are more likely to be delivered or cancelled.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
