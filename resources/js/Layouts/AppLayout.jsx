import ApplicationLogo from "@/Components/ApplicationLogo"
import { Link } from "@inertiajs/react"

function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md capitalize">
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
                            <i className="fa fa-heart text-2xl"></i>
                            <span className="text-sm font-bold absolute bottom-4 left-5">0</span>
                        </div>
                        <div className="">
                            <span className="text-sm font-bold">Total</span>
                            <span className="ml-2 text-sm font-bold">৳ 0.00</span>
                        </div>
                    </div>
                </div>

                <hr className='' />
                <div className="container mx-auto py-4 flex flex-wrap items-center gap-4">
                    {/* {
                        categories.map((category, index) => (
                            <NavLink key={index} className={"text-sm font-bold text-gray-400"} to={`/${category.name}`}>{category.name}</NavLink>
                        ))
                    } */}
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                {children}
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
                                <img src="images/bkash.jpg" alt="bkash" className="h-8" />
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
    )
}
export default AppLayout
