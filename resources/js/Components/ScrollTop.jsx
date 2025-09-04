import { useEffect, useState } from "react";

function ScrollTop() {
    const [isVisible, setIsVisible] = useState(false);
    // Toggle visibility based on scroll position
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        isVisible && <button onClick={scrollToTop} className="bg-blue-500 rounded-full text-white">
            <i className="fa fa-arrow-up text-2xl p-3"></i>
        </button>
    )
}

export default ScrollTop
