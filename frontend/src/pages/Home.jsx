import React from "react";
import hero from "../assets/image.png";

const Home = () => {
    return (
        <div className="relative h-screen overflow-hidden" style={{ background: 'var(--color-ps-bckgnd)' }}>
            <p style={{ fontFamily: 'Italiana', color: 'var(--color-ps-fo)' }} className="absolute left-10 top-4 z-30 text-3xl">PrivyScan</p>

            <div className="relative z-30 h-full flex items-center">
                <div className="pl-14 mt-10 max-w-[720px]">
                    <h1 style={{ fontFamily: 'Italiana', color: 'var(--color-ps-yb)', fontSize: '45px', lineHeight: '50px', whiteSpace: 'nowrap'}}>
                        Agreeing to privacy policies<br />
                        without reading them? <span style={{ fontFamily: 'Oooh Baby', color: 'var(--color-ps-fo)', fontSize: '45px', lineHeight: '50px', whiteSpace: 'nowrap' }}>Not anymore.</span>
                    </h1>

                    <p style={{ fontFamily: 'Kokoro', color: 'var(--color-ps-yb)', fontSize: '20px', lineHeight: '32px' }} className="mt-6 max-w-[721px]">
                        We break down privacy policies into simple insights and grade <br />them, so you know exactly what you're agreeing to.
                    </p>

                    <div className="mt-8">
                        <div style={{ border: '4px solid var(--color-ps-yb)', borderRadius: '42px' }} className="flex items-center w-[600px] px-6 py-3">
                            <input aria-label="url" className="flex-1 outline-none bg-transparent placeholder:text-[#9aa6b3] text-[24px]" placeholder="https://example.com" style={{ fontFamily: 'Junge' }} />
                            <button className="ml-6 scale-200 text-ps-yb text-[24px]" >→</button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className="absolute right-0 top-0 bottom-10 w-1/2 z-10 pointer-events-none overflow-hidden flex items-start justify-end">
                <img src={hero} alt="hero" style={{ height: '100%', objectFit: 'contain', objectPosition: 'right top' }} className="max-w-none" />
            </div>
            <p style={{ fontFamily: 'Pecita', fontSize: '24px' }} className="absolute right-30 bottom-4 text-ps-yb">By Team Spaghetti</p>
        </div>
    )
}

export default Home;