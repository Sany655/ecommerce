import React, { useState, useEffect } from 'react';
import ApplicationLogo from './ApplicationLogo';

const Carousel = ({ categories: items, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, interval);

        return () => clearInterval(slideInterval); // Clear interval on component unmount
    }, [items.length, interval]);

    return (
        <div className="relative w-full overflow-hidden">
            {/* Carousel Wrapper */}
            <div
                className="flex transition-transform ease-in-out duration-1000"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        {/* Flex container for the image and content */}
                        <div className="md:grid grid-cols-2 object-contain">
                            <img
                                src={'storage/' + item.banner}
                                alt={`Slide ${index}`}
                                className="w-full object-cover"
                            />
                            <div className="bg-black bg-opacity-50 p-4 flex flex-col items-center justify-center text-white gap-2">
                                <ApplicationLogo className="my-5"/>
                                <h2 className="text-xl font-bold">{item.name}</h2>
                                <p className="text-md">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
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
