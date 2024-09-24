import ApplicationLogo from "@/Components/ApplicationLogo"
import ScrollTop from "@/Components/ScrollTop"
import useCart, { CartProvider } from "@/Hooks/useCart"
import { Link, router } from "@inertiajs/react"
import { useState } from "react"

function AppLayout({ children }) {

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-6 relative">
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
    const totalPrice = cart?.reduce((acc, item) => Math.round(acc + (item.product?.discount_price || item.product?.price) * item.quantity), 0)
    const [searchInput, setSearchInput] = useState('')
    const handleSearch = e => {
        e.preventDefault();
        router.visit(route('home.search', searchInput))
    }

    return (
        <header className="bg-white shadow-md capitalize sticky top-0 z-50">
            <div className="container mx-auto pt-8 pb-4 flex flex-col md:flex-row justify-between items-center text-blue-500 gap-5">
                <div className="flex items-center">
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <form className="relative" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="text-black w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <i className="fa fa-search absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleSearch}></i>
                    </form>
                    <div className="relative hover:text-gray-500">
                        <Link href={route('cart.index')}>
                            <i className="fa fa-heart text-2xl"></i>
                            <span className="text-sm font-bold absolute bottom-4 left-5">{cart.length}</span>
                        </Link>
                    </div>
                    <div className="">
                        <span className="text-sm font-bold">Total</span>
                        <span className="ml-2 text-sm font-bold">৳ {totalPrice}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Logo and Motto */}
                <div>
                    {/* <img src="/path/to/logo.png" alt="Sunnah Corner" className="mx-auto md:mx-0 mb-4" /> */}
                    <Link className="text-xl font-bold text-blue-500" href="/">
                        <ApplicationLogo />
                    </Link>
                    <p className="text-sm text-gray-700">
                        Online Based Premium Islamic Lifestyle Shop. <br />
                        Our motto is “Ad dawah bit-teezarah”. Dawah by business.
                    </p>
                </div>

                {/* Payment Methods and Contact Information */}
                <div className="md:text-center">
                    <div className="mb-4">
                        <h5 className="text-lg font-semibold text-gray-800 mb-2">We Accept</h5>
                        <div className="flex justify-center space-x-2">
                            <img src="/images/bkash.jpg" alt="bkash" className="h-8" />
                        </div>
                    </div>

                </div>

                {/* Download App */}
                <div className="md:text-right text-sm text-gray-700">
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h5>
                    <p>📞 (+88) 01646-790153</p>
                    <p>✉️ contact@sunnahcorner.com</p>
                </div>
            </div>
            <div className="container mx-auto text-center mt-8 border-t pt-4">
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="https://facebook.com" className="text-gray-600 hover:text-gray-800">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://instagram.com" className="text-gray-600 hover:text-gray-800">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-800">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
                <p className="text-sm text-gray-700">
                    Best Islamic Lifestyle Brand in Bangladesh | sunnahcorner.com | Designed by: Theme Freesia | © 2024 WordPress
                </p>
            </div>
        </footer>
    )
}
export default AppLayout
