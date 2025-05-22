import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard(props) {

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Total Users */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-8 0 4 4 0 008 0zm6 2a4 4 0 10-8 0 4 4 0 008 0z" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-500">Total Users</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">1,234</div>
                        </div>
                        {/* Orders Today */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-500">Orders Today</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">56</div>
                        </div>
                        {/* Revenue */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-500">Revenue</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">$7,890</div>
                        </div>
                        {/* Pending Shipments */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8zm6 6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a6 6 0 0112 0z" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-500">Pending Shipments</div>
                            <div className="mt-1 text-3xl font-bold text-gray-900">12</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
