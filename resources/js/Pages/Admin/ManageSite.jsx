import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { set } from 'lodash';
import { use, useEffect, useState } from 'react';

function ManageSite(props) {
    // Split forms for each section
    const [logoPreview, setLogoPreview] = useState('');
    const [faviconPreview, setFaviconPreview] = useState('');
    const [inputs, setInputs] = useState({
        companyForm: {
            name: '',
            motto: '',
            description: ''
        },
        contactForm: {
            email: '',
            phone: '',
            address: '',
        },
        socialForm: [],
        paymentForm: [],
        colorForm: {
            primary_color: '',
            secondary_color: '',
            accent_color: '',
        }
    });

    const logoForm = useForm({ logo: null, favicon: null });

    useEffect(() => {
        fetch('/site-contact-info')
            .then(response => response.json())
            .then(data => {
                console.log(data);

                setInputs({
                    companyForm: {
                        name: data.company.name,
                        motto: data.company.motto,
                        description: data.company.description
                    },
                    contactForm: {
                        email: data.contact.email,
                        phone: data.contact.phone,
                        address: data.contact.address,
                    },
                    socialForm: data.social_media || [],
                    paymentForm: data.payment_methods || [],
                    colorForm: {
                        primary_color: data.theme?.primary_color || '#000000',
                        secondary_color: data.theme?.secondary_color || '#FFFFFF',
                        accent_color: data.theme?.accent_color || '#FF0000',
                    }
                });
            });
        setLogoPreview('storage/setting/logo.png');
        setFaviconPreview('storage/setting/favicon.png');

    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        logoForm.setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFaviconChange = (e) => {
        const file = e.target.files[0];
        logoForm.setData('favicon', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFaviconPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    function saveSocialMedia(e) {
        e.preventDefault();
        axios.post(route('settings.social_info_update'), {
            social_media: inputs.socialForm
        }).then(() => {
            alert('Social media informations updated successfully');
        }).catch(error => {
            console.error(error);
        });
    }

    function savePaymentInfo(e) {
        e.preventDefault();
        axios.post(route('settings.payment_info_update'), {
            payment_methods: inputs.paymentForm
        }).then((res) => {
            alert(res.data.message || 'Payment methods updated successfully');
        }).catch(error => {
            console.error(error);
        });
        
    }

    function saveCompanyInfo(e) {
        e.preventDefault();
        axios.post(route('settings.company_info_update'), {
            name: inputs.companyForm.name,
            motto: inputs.companyForm.motto,
            description: inputs.companyForm.description
        }).then(() => {
            alert('Company informations updated successfully');
        }).catch(error => {
            console.error(error);
        });
    }

    function saveContactInfo(e) {
        e.preventDefault();
        axios.post(route('settings.contact_info_update'), {
            email: inputs.contactForm.email,
            phone: inputs.contactForm.phone,
            address: inputs.contactForm.address
        }).then(() => {
            alert('Contact informations updated successfully');
        }).catch(error => {
            console.error(error);
        });
    }

    function saveColorInfo(e) {
        e.preventDefault();
        axios.post(route('settings.color_info_update'), {
            theme: inputs.colorForm
        }).then(() => {
            alert('Color settings updated successfully');
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12 container mx-auto">
                <div className="grid gap-5 md:gap-10">

                    {/* Logo and Favicon Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col gap-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Logo & Favicon</h4>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                logoForm.post(route('settings.logo_and_favicon_upload'), {
                                    onSuccess: () => {
                                        alert('Logo and Favicon updated successfully');
                                        logoForm.reset('logo', 'favicon');
                                    }
                                });
                            }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Logo Upload */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="h-20 w-20 flex items-center justify-center border border-gray-200 rounded bg-gray-50 mb-2">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo preview" className="h-16 w-16 object-contain" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Logo</span>
                                            )}
                                        </div>
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
                                        <span className="text-xs text-gray-500 mt-1">Logo</span>
                                        {logoForm.errors.logo && (
                                            <span className="text-xs text-red-500">{logoForm.errors.logo}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Favicon Upload */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="h-20 w-20 flex items-center justify-center border border-gray-200 rounded bg-gray-50 mb-2">
                                            {faviconPreview ? (
                                                <img src={faviconPreview} alt="Logo preview" className="h-16 w-16 object-contain" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Favicon</span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFaviconChange}
                                            className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                        />
                                        <span className="text-xs text-gray-500 mt-1">Favicon</span>
                                        {logoForm.errors.favicon && (
                                            <span className="text-xs text-red-500">{logoForm.errors.favicon}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={logoForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    Save Logo & Favicon
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Company Information Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Company Informations</h4>
                        <form
                            onSubmit={saveCompanyInfo}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={inputs.companyForm.name}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        companyForm: {
                                            ...prev.companyForm,
                                            name: e.target.value
                                        }
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Motto</label>
                                <input
                                    type="text"
                                    value={inputs.companyForm.motto}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        companyForm: {
                                            ...prev.companyForm,
                                            motto: e.target.value
                                        }
                                    }))}

                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={inputs.companyForm.description}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        companyForm: {
                                            ...prev.companyForm,
                                            description: e.target.value
                                        }
                                    }))}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    // disabled={companyForm.processing}
                                    className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Company Information
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Contact Information</h4>
                        <form
                            onSubmit={saveContactInfo}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={inputs.contactForm.email}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        contactForm: {
                                            ...prev.contactForm,
                                            email: e.target.value
                                        }
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    value={inputs.contactForm.phone}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        contactForm: {
                                            ...prev.contactForm,
                                            phone: e.target.value
                                        }
                                    }))}

                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    value={inputs.contactForm.address}
                                    onChange={e => setInputs(prev => ({
                                        ...prev,
                                        contactForm: {
                                            ...prev.contactForm,
                                            address: e.target.value
                                        }
                                    }))}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    // disabled={this.processing}
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
                        <form onSubmit={e => {
                            e.preventDefault();
                            const paymentName = e.currentTarget?.paymentName.value;
                            if (!paymentName) {
                                return;
                            }
                            setInputs(prev => ({
                                ...prev,
                                paymentForm: [...prev.paymentForm, paymentName]
                            }));
                            e.currentTarget.reset();
                        }} className="flex gap-4 mb-4">
                            <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name='paymentName' />
                            <button><i className="fa fa-plus"></i></button>
                        </form>
                        <form
                            onSubmit={savePaymentInfo}
                            className="flex flex-col gap-4"
                        >
                            {
                                inputs.paymentForm.map((payment, index) => (
                                    <div key={index} className='flex gap-4'>
                                        <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 flex-1" value={payment} onChange={e => {
                                            setInputs(prev => {
                                                const updatedPayments = [...prev.paymentForm];
                                                updatedPayments[index] = e.target.value;
                                                return { ...prev, paymentForm: updatedPayments };
                                            });
                                        }}/>
                                        <button onClick={() => {
                                            setInputs(prev => ({
                                                ...prev,
                                                paymentForm: prev.paymentForm.filter((_, i) => i !== index)
                                            }));
                                        }} type='button'><i className="fa fa-trash"></i></button>
                                    </div>
                                ))
                            }
                            <button className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                                Save Payment Info
                            </button>
                        </form>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Social Media Links</h4>
                        <form onSubmit={e => {
                            e.preventDefault();
                            const mediaName = e.currentTarget?.mediaName.value;
                            const link = e.currentTarget?.link.value;
                            if (!mediaName || !link) {
                                return;
                            }
                            setInputs(prev => ({
                                ...prev,
                                socialForm: [...prev.socialForm, { name: mediaName, link: link }]
                            }));
                            e.currentTarget.reset();
                        }} className="flex items-center gap-4 mb-4">
                            <input type="text" placeholder='Name' className='block border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' name='mediaName' required />
                            <input type="url" placeholder='Link' className='block border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 flex-1' name='link' required />
                            <button type='submit'><i className="fa fa-plus"></i></button>
                        </form>
                        <form
                            onSubmit={saveSocialMedia}
                            className="flex flex-col gap-4"
                        >
                            {
                                inputs.socialForm.map((social, index) => (
                                    <div key={index} className='flex items-center gap-4'>
                                        <input
                                            required
                                            type="text"
                                            value={social.name}
                                            onChange={e => setInputs(prev => {
                                                const updatedSocial = [...prev.socialForm];
                                                updatedSocial[index] = {
                                                    ...updatedSocial[index],
                                                    name: e.target.value
                                                };
                                                return { ...prev, socialForm: updatedSocial };
                                            })}
                                            className="block border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <input
                                            required
                                            type="url"
                                            value={social.link}
                                            onChange={e => setInputs(prev => {
                                                const updatedSocial = [...prev.socialForm];
                                                updatedSocial[index] = {
                                                    ...updatedSocial[index],
                                                    link: e.target.value
                                                };
                                                return { ...prev, socialForm: updatedSocial };
                                            })}
                                            className="block border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 flex-1"
                                        />
                                        <button type="button" onClick={() => setInputs(prev => {
                                            const updatedSocial = [...prev.socialForm];
                                            updatedSocial.splice(index, 1);
                                            return { ...prev, socialForm: updatedSocial };
                                        })}><i className="fa fa-trash"></i></button>
                                    </div>
                                ))
                            }
                            <button className='bg-blue-500 text-white rounded py-2'>Submit</button>
                            {/* <div>
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
                            </div> */}
                        </form>
                    </div>

                    {/* Color Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Brand Colors</h4>
                        <form
                            onSubmit={saveColorInfo}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={inputs.colorForm.primary_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                primary_color: e.target.value
                                            }
                                        }))}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={inputs.colorForm.primary_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                primary_color: e.target.value
                                            }
                                        }))}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={inputs.colorForm.secondary_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                secondary_color: e.target.value
                                            }
                                        }))}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={inputs.colorForm.secondary_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                secondary_color: e.target.value
                                            }
                                        }))}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={inputs.colorForm.accent_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                accent_color: e.target.value
                                            }
                                        }))}
                                        className="h-8 w-8 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={inputs.colorForm.accent_color}
                                        onChange={e => setInputs(prev => ({
                                            ...prev,
                                            colorForm: {
                                                ...prev.colorForm,
                                                accent_color: e.target.value
                                            }
                                        }))}

                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-3 flex justify-end pt-2">
                                <button
                                    type="submit"
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
    )
}

export default ManageSite