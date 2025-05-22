import ApplicationLogo from "@/Components/ApplicationLogo"
import NavLink from "@/Components/NavLink"
import ScrollTop from "@/Components/ScrollTop"
import useCart, { CartProvider } from "@/Hooks/useCart"
import { Link, router, usePage } from "@inertiajs/react"
import axios from "axios"
import { useEffect, useState } from "react"

function AppLayout({ children }) {
    const { url } = usePage();

    useEffect(() => {
        fbq('track', 'PageView');
    }, [url]);


    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container relative px-4 py-6 mx-auto">
                    {children}
                    <ScrollTop />
                </main>
                <Footer />
            </div>
        </CartProvider>
    )
}


const Header = () => {
    const { cart } = useCart()
    const [searchInput, setSearchInput] = useState('')
    const handleSearch = e => {
        e.preventDefault();
        router.visit(route('home.search', searchInput))
    }
    const [categories, setcategories] = useState([])
    useEffect(() => {
        axios.get(route('categories.get_all')).then(response => setcategories(response.data)).catch(error => console.log(error.message))
    }, [])

    return (
        <header className="sticky top-0 z-50 capitalize bg-white shadow-md">
            <div className="container flex flex-col items-center justify-between gap-5 pt-8 pb-8 mx-auto text-blue-500 md:flex-row">
                <div className="flex items-center">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                </div>
                <div className="flex items-center justify-between gap-4">
                    {/* Search Bar */}
                    <form className="relative flex-shrink" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 text-black border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <i
                            className="absolute transform -translate-y-1/2 cursor-pointer fa fa-search right-4 top-1/2"
                            onClick={handleSearch}
                        ></i>
                    </form>

                    {/* Wishlist Icon */}
                    <div className="relative hover:text-gray-500">
                        <Link href={route('cart.index')} className="relative text-2xl">
                            <i className="fa fa-heart"></i>
                            {/* Cart item count */}
                            <span className="absolute text-xs font-bold bg-red-600 text-white rounded-full px-1 top-0 right-0 transform translate-x-3 -translate-y-1">
                                {cart.cart_items?.length}
                            </span>
                        </Link>
                    </div>

                    {/* Total Amount */}
                    <p className="line-clamp-2 text-xs md:text-sm font-bold">
                        Total: {cart.total_amount} BDT
                    </p>
                </div>


            </div>
            {
                categories.length > 0 && (
                    <div className="">
                        <hr />
                        <div className="container mx-auto flex flex-wrap items-center gap-2 md:gap-4 py-2 capitalize">
                            {
                                categories.map((category, index) => (
                                    <NavLink key={index} className={"text-sm font-bold text-gray-400"} href={route(`home.category_products`, category.id)} active={route().current(`home.category_products`, category.id)}>{category.name}</NavLink>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </header>
    )
}

const Footer = () => {
    const [contactInfo, setContactInfo] = useState({})
    useEffect(() => {
        axios.get(route('home.contact_info')).then(response => {
            setContactInfo(response.data)
            console.log(response.data);
            
        }).catch(error => console.log(error.message))
    }, [])
    return (
        <footer className="py-8 bg-gray-100">
            <div className="container grid grid-cols-1 gap-8 mx-auto text-center md:grid-cols-3 md:text-left">
                {/* Logo and Motto */}
                <div className="flex items-center md:items-start flex-col gap-2">
                    <Link className="text-xl font-bold text-blue-500" href="/">
                        <ApplicationLogo />
                    </Link>
                    <p className="text-sm text-gray-700">
                        {contactInfo.company?.description} <br />
                        Our motto is “{contactInfo.company?.motto}”. Dawah by business.
                    </p>
                </div>

                {/* Payment Methods and Contact Information */}
                <div className="md:text-center">
                    <div className="mb-4">
                        <h5 className="mb-2 text-lg font-semibold text-gray-800">We Accept</h5>
                        {contactInfo.payment_methods && contactInfo.payment_methods.map((method, index) => (
                            <div className="flex justify-center space-x-2">
                                <img src={`/images/${method}.jpg`} alt="bkash" className="h-8" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download App */}
                <div className="text-sm text-gray-700 md:text-right">
                    <h5 className="mb-2 text-lg font-semibold text-gray-800">Contact Us</h5>
                    {contactInfo.contact?.phone && <p>📞 (+88) {contactInfo.contact?.phone}</p>}
                    {contactInfo.contact?.email && <p>✉️ {contactInfo.contact?.email}</p>}
                    {contactInfo.contact?.address && <p>🏢 {contactInfo.contact?.address}</p>}
                </div>
            </div>
            <div className="container pt-4 mx-auto mt-8 text-center border-t">
                <div className="flex justify-center mb-4 space-x-4">
                    {contactInfo.social_media?.map((social, index) => (
                        <a key={index} href={social.link} className="text-gray-600 hover:text-gray-800" target="_blank">
                            <i className={`fab fa-${social.name}`}></i>
                        </a>
                    ))}
                </div>
                <p className="text-sm text-gray-700">
                    {contactInfo.company?.name} | {contactInfo.legal?.domain} {contactInfo.legal?.copyright} | {contactInfo.legal?.all_rights_reserved && "All Rights Reserved"}
                </p>
            </div>
        </footer>
    )
}
export default AppLayout
