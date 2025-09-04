import React from 'react'
import { useEffect, useState } from "react";

function FloatingIcons() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>

            <div className="flex flex-col items-center my-3">
                {/* Dropdown Menu */}
                <div className={`${isOpen ? 'block' : 'hidden'} flex flex-col gap-4 mb-3`}>
                    <a className="bg-green-500 rounded-full text-white" href="sms:+8801234567890" target='_blank' rel='noreferrer'>
                        <i className="fa fa-message text-2xl p-3"></i>
                    </a>
                    <a className="bg-green-500 rounded-full text-white" href="tel:+8801234567890" target='_blank' rel='noreferrer'>
                        <i className="fa fa-phone text-2xl p-3"></i>
                    </a>
                    <a className="bg-green-500 rounded-full text-white" href='https://wa.me/8801234567890' target='_blank' rel='noreferrer'>
                        <i className="fa fa-whatsapp text-2xl p-3"></i>
                    </a>
                </div>
                <button className="bg-green-500 rounded-full text-white p-3" onClick={toggleDropdown}>Contact Us</button>

            </div>
        </>
    )
}

export default FloatingIcons