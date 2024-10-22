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
    // const totalPrice = cart?.reduce((acc, item) => Math.round(acc + parseInt(item.subtotal)), 0)
    const [searchInput, setSearchInput] = useState('')
    const handleSearch = e => {
        e.preventDefault();
        router.visit(route('home.search', searchInput))
    }

    return (
        <header className="sticky top-0 z-50 capitalize bg-white shadow-md">
            <div className="container flex flex-col items-center justify-between gap-5 pt-8 pb-4 mx-auto text-blue-500 md:flex-row">
                <div className="flex items-center">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <form className="relative" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 text-black border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <i className="absolute transform -translate-y-1/2 cursor-pointer fa fa-search right-4 top-1/2" onClick={handleSearch}></i>
                    </form>
                    <div className="relative hover:text-gray-500">
                        <Link href={route('cart.index')}>
                            <i className="text-2xl fa fa-heart"></i>
                            <span className="absolute text-sm font-bold bottom-4 left-5">{cart.cart_items?.length}</span>
                        </Link>
                    </div>
                    <div className="">
                        <span className="text-sm font-bold">Total</span>
                        <span className="ml-2 text-sm font-bold">৳ {cart.total_amount}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

const Footer = () => {
    return (
        <footer className="py-8 bg-gray-100">
            <div className="container grid grid-cols-1 gap-8 mx-auto text-center md:grid-cols-2 md:text-left">
                {/* Logo and Motto */}
                <div>
                    {/* <img src="/path/to/logo.png" alt="Sunnah Corner" className="mx-auto mb-4 md:mx-0" /> */}
                    <Link className="text-xl font-bold text-blue-500" href="/">
                        <ApplicationLogo className={"mb-2"}/>
                    </Link>
                    <p className="text-sm text-gray-700">
                        Online Based Premium Islamic Lifestyle Shop. <br />
                        Our motto is “Ad dawah bit-teezarah”. Dawah by business.
                    </p>
                </div>

                {/* Payment Methods and Contact Information */}
                {/* <div className="md:text-center">
                    <div className="mb-4">
                        <h5 className="mb-2 text-lg font-semibold text-gray-800">We Accept</h5>
                        <div className="flex justify-center space-x-2">
                            <img src="/images/bkash.jpg" alt="bkash" className="h-8" />
                        </div>
                    </div>

                </div> */}

                {/* Download App */}
                <div className="text-sm text-gray-700 md:text-right">
                    <h5 className="mb-2 text-lg font-semibold text-gray-800">Contact Us</h5>
                    <p>📞 (+88) 01854846414</p>
                    <p>✉️ Info@hamdaanz.com</p>
                </div>
            </div>
            <div className="container pt-4 mx-auto mt-8 text-center border-t">
                <div className="flex justify-center mb-4 space-x-4">
                    <a href="https://www.tiktok.com/@hamdaans1" className="text-gray-600 hover:text-gray-800" target="_blank">
                        <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="https://www.facebook.com/hamdaanzz?mibextid=LQQJ4d" className="text-gray-600 hover:text-gray-800" target="_blank">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/hamdaan_z/profilecard/" target="_blank" className="text-gray-600 hover:text-gray-800">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
                <p className="text-sm text-gray-700">
                    Islamic Lifestyle Brand in Bangladesh | hamdaanz.com
                </p>
            </div>
        </footer>
    )
}
export default AppLayout
