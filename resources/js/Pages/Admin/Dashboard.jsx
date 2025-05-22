import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard(props) {
    // Split forms for each section
    const logoForm = useForm({ logo: null });
    const [logoPreview, setLogoPreview] = useState(null);

    const sloganForm = useForm({ slogan: '', motto: '' });
    const contactForm = useForm({
        contact_email: '',
        contact_phone: '',
        contact_address: '',
    });
    const paymentForm = useForm({
        payment_methods: {
            stripe: false,
            paypal: false,
            bank_transfer: false,
        },
    });
    const socialForm = useForm({
        social_media: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    });
    const colorForm = useForm({
        primary_color: '#000000',
        secondary_color: '#ffffff',
        accent_color: '#3b82f6',
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        logoForm.setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 container mx-auto">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">

                    {/* Logo & Favicon Upload Section */}
                    <div className="bg-white flex flex-col items-start justify-between shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Logo & Favicon</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                logoForm.post(route('admin.settings.update'));
                            }}
                            className=""
                        >
                            <div className="flex flex-col items-center gap-2">
                                {logoPreview && (
                                    <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-contain" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                <span className="text-xs text-gray-500">Logo</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                {logoForm.data.favicon && (
                                    <img
                                        src={URL.createObjectURL(logoForm.data.favicon)}
                                        alt="Favicon preview"
                                        className="h-10 w-10 object-contain"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/x-icon,image/png"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        logoForm.setData('favicon', file);
                                    }}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                <span className="text-xs text-gray-500">Favicon</span>
                            </div>
                            <button
                                type="submit"
                                disabled={logoForm.processing}
                                className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                            >
                                Save Logo & Favicon
                            </button>
                        </form>
                    </div>

                    {/* Slogan and Motto Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Slogan & Motto</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                sloganForm.post(route('admin.settings.update'));
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slogan</label>
                                <input
                                    type="text"
                                    value={sloganForm.data.slogan}
                                    onChange={e => sloganForm.setData('slogan', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Motto</label>
                                <input
                                    type="text"
                                    value={sloganForm.data.motto}
                                    onChange={e => sloganForm.setData('motto', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sloganForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Slogan & Motto
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Contact Information</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                contactForm.post(route('admin.settings.update'));
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={contactForm.data.contact_email}
                                    onChange={e => contactForm.setData('contact_email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    value={contactForm.data.contact_phone}
                                    onChange={e => contactForm.setData('contact_phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    value={contactForm.data.contact_address}
                                    onChange={e => contactForm.setData('contact_address', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={contactForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Contact Info
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Payment Methods</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                paymentForm.post(route('admin.settings.update'));
                            }}
                            className="space-y-2"
                        >
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={paymentForm.data.payment_methods.stripe}
                                    onChange={e => paymentForm.setData('payment_methods', {
                                        ...paymentForm.data.payment_methods,
                                        stripe: e.target.checked
                                    })}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Stripe</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={paymentForm.data.payment_methods.paypal}
                                    onChange={e => paymentForm.setData('payment_methods', {
                                        ...paymentForm.data.payment_methods,
                                        paypal: e.target.checked
                                    })}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">PayPal</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={paymentForm.data.payment_methods.bank_transfer}
                                    onChange={e => paymentForm.setData('payment_methods', {
                                        ...paymentForm.data.payment_methods,
                                        bank_transfer: e.target.checked
                                    })}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Bank Transfer</span>
                            </label>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={paymentForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Payment Methods
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Social Media Links</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                socialForm.post(route('admin.settings.update'));
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                                <input
                                    type="url"
                                    value={socialForm.data.social_media.facebook}
                                    onChange={e => socialForm.setData('social_media', {
                                        ...socialForm.data.social_media,
                                        facebook: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                                <input
                                    type="url"
                                    value={socialForm.data.social_media.twitter}
                                    onChange={e => socialForm.setData('social_media', {
                                        ...socialForm.data.social_media,
                                        twitter: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                                <input
                                    type="url"
                                    value={socialForm.data.social_media.instagram}
                                    onChange={e => socialForm.setData('social_media', {
                                        ...socialForm.data.social_media,
                                        instagram: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                                <input
                                    type="url"
                                    value={socialForm.data.social_media.linkedin}
                                    onChange={e => socialForm.setData('social_media', {
                                        ...socialForm.data.social_media,
                                        linkedin: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={socialForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Social Links
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Color Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Brand Colors</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                colorForm.post(route('admin.settings.update'));
                            }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={colorForm.data.primary_color}
                                        onChange={e => colorForm.setData('primary_color', e.target.value)}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={colorForm.data.primary_color}
                                        onChange={e => colorForm.setData('primary_color', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={colorForm.data.secondary_color}
                                        onChange={e => colorForm.setData('secondary_color', e.target.value)}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={colorForm.data.secondary_color}
                                        onChange={e => colorForm.setData('secondary_color', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={colorForm.data.accent_color}
                                        onChange={e => colorForm.setData('accent_color', e.target.value)}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={colorForm.data.accent_color}
                                        onChange={e => colorForm.setData('accent_color', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-3 flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={colorForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Colors
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
