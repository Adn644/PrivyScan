import React from "react";
import hero from "../assets/image.png";
import { FaArrowRight } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import grass from "../assets/grass.png";

const Home = () => {
    const navigate = useNavigate();
    const [pageUrl, setPageUrl] = useState("");
    const handleSubmit = () => {
        navigate('/analysis', { state: { pageUrl } });
    };

    return (
        <div className="relative h-screen overflow-hidden">
            <p style={{ fontFamily: 'Italiana', color: 'var(--color-ps-fo)' }} className="absolute left-2 sm:left-4 top-4 z-30 text-2xl sm:text-3xl">PrivyScan</p>

            <div className="relative z-30 h-full flex items-center">
                <div className="pl-4 sm:pl-14 mt-10 max-w-full sm:max-w-[720px] px-4 sm:px-0">
                    <h1 style={{ fontFamily: 'Italiana', color: 'var(--color-ps-yb)', fontSize: 'clamp(28px, 6vw, 45px)', lineHeight: '1.2'}}>
                        Agreeing to privacy policies
                        without reading them?{" "}
                        <span style={{ fontFamily: 'Oooh Baby', color: 'var(--color-ps-fo)', fontSize: 'clamp(28px, 6vw, 45px)', lineHeight: '1.2' }}>Not anymore.</span>
                    </h1>

                    <p style={{ fontFamily: 'Kokoro', color: 'var(--color-ps-yb)', fontSize: 'clamp(16px, 4vw, 20px)', lineHeight: '1.6' }} className="mt-6 max-w-[721px]">
                        We break down privacy policies into simple insights and grade <br className="hidden md:block"/>them, so you know exactly what you're agreeing to.
                    </p>

                    <div className="mt-8">
                        <div style={{ border: '4px solid var(--color-ps-yb)', borderRadius: '42px' }} className="flex items-center w-full sm:w-[600px] px-3 py-2">
                            <input
                                aria-label="url"
                                value={pageUrl}
                                onChange={(event) => setPageUrl(event.target.value)}
                                className="flex-1 outline-none bg-transparent placeholder:text-[#9aa6b3] text-base sm:text-xl"
                                placeholder="https://example.com"
                                style={{ fontFamily: 'Junge' }}
                            />
                            <FaArrowRight 
                                onClick={handleSubmit}
                            className="text-ps-yb" />
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className="hidden md:flex absolute right-0 top-0 bottom-10 w-1/2 z-10 pointer-events-none overflow-hidden items-start justify-end">
                <img src={hero} alt="hero" style={{ height: '100%', objectFit: 'contain', objectPosition: 'right top' }} className="max-w-none" />
            </div>
            <p style={{ fontFamily: 'Pecita', fontSize: 'clamp(16px, 4vw, 24px)' }} className="absolute left-4 sm:right-30 sm:bottom-4 bottom-2 text-ps-yb text-center sm:text-right">By Team Spaghetti</p>
            <img
                src={grass}
                className="absolute bottom-0 right-0 w-fit h-fit object-cover md:hidden"
            />
        </div>
    )
}

export default Home;