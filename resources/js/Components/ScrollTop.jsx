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
        isVisible && <button onClick={scrollToTop} className="bg-blue-500 rounded-full text-white w-10 h-10 fixed bottom-10 right-0 xl:right-40">
            <i className="fa fa-arrow-up"></i>
        </button>
    )
}

const styles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    zIndex: 1000
};
export default ScrollTop
