import React, { useState, useEffect } from 'react';
import ApplicationLogo from './ApplicationLogo';

const Carousel = ({ categories: items, interval = 3000, children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, interval);

        console.log(items);
        return () => clearInterval(slideInterval); // Clear interval on component unmount
        
    }, [items.length, interval]);

    return (
        <div className="relative w-full overflow-hidden">
            {/* Carousel Wrapper */}
            <div
                className="flex transition-transform ease-in-out duration-1000"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {children}
            </div>

            {/* Left and Right Buttons */}
            <button
                onClick={() =>
                    setCurrentIndex((currentIndex - 1 + items.length) % items.length)
                }
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500 text-4xl focus:outline-none"
            >
                ‹
            </button>
            <button
                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-blue-500 text-4xl focus:outline-none"
            >
                ›
            </button>
        </div>
    );
};

export default Carousel;
