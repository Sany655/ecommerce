import React, { useState, useEffect } from 'react';

const Carousel = ({ categories:items, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, interval);

        return () => clearInterval(slideInterval); // Clear interval on component unmount
    }, [items.length, interval]);

    return (
        <div className="relative w-full overflow-hidden h-64">
            {/* Carousel Wrapper */}
            <div
                className="flex transition-transform ease-in-out duration-1000"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                            src={'storage/'+item.banner}
                            alt={`Slide ${index}`}
                            className="w-full h-64 object-cover"
                        />
                        {/* Text overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            <h2 className="text-xl font-bold">{item.name}</h2>
                            <p className='text-l'>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Left and Right Buttons */}
            <button
                onClick={() =>
                    setCurrentIndex((currentIndex - 1 + items.length) % items.length)
                }
                className="absolute left-5 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white text-black rounded-full shadow-md focus:outline-none"
            >
                ‹
            </button>
            <button
                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white text-black rounded-full shadow-md focus:outline-none"
            >
                ›
            </button>
        </div>
    );
};

export default Carousel;
