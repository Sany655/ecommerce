import ApplicationLogo from "@/Components/ApplicationLogo"
import useCart, { CartProvider } from "@/Hooks/useCart"
import { Link } from "@inertiajs/react"
import { useEffect, useState } from "react"

function AppLayout({ children }) {
    const [loading, setLoading] = useState(false)
    function onLoading(isLoading) {
        setLoading(isLoading)
    }
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <Header onLoading={onLoading} />
                <main className="container mx-auto px-4 py-6">
                    {loading ? <div className="h-screen flex items-center justify-center"><svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg></div> : children}
                </main>
                <footer className="bg-gray-100 py-8">
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        {/* Logo and Motto */}
                        <div>
                            {/* <img src="/path/to/logo.png" alt="Sunnah Corner" className="mx-auto md:mx-0 mb-4" /> */}
                            <Link className="text-xl font-bold text-orange-500" href="/">Sunnah Corner</Link>
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
            </div>
        </CartProvider>
    )
}


const Header = ({ onLoading }) => {
    const { cart, cartLoading } = useCart()
    const totalPrice = cart?.reduce((acc, item) => Math.round(acc + (item.product?.discount_price || item.product?.price) * item.quantity), 0)
    useEffect(() => {
        onLoading(cartLoading)
    }, [cartLoading])

    return (
        <header className="bg-white shadow-md capitalize sticky top-0 z-50">
            <div className="container mx-auto pt-8 pb-4 flex flex-col md:flex-row justify-between items-center text-orange-500">
                <div className="flex items-center">
                    {/* <img src="logo.png" alt="Logo" className="h-10" /> */}
                    {/* <Link href="/" className="text-xl font-bold">Sunnah Corner</Link> */}
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="text-black w-full px-4 py-2 rounded-md border border-orange-300 focus:outline-none focus:ring focus:ring-orange-300"
                        />
                        <i className="fa fa-search absolute right-4 top-1/2 transform -translate-y-1/2"></i>
                    </div>
                    <div className="relative hover:text-red-500">
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
export default AppLayout
