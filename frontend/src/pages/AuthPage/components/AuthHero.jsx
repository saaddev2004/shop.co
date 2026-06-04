import React from 'react';
import { Link } from "react-router-dom";

const AuthHero = () => {
    return (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
            <div className="relative z-10">
                <Link to="/" className="text-3xl font-extrabold tracking-tight font-heading mb-12 block">
                SHOP.CO
                </Link>
                <h1 className="text-5xl font-extrabold leading-tight mb-6">
                Elevate Your <br /> Shopping <br /> Experience.
                </h1>
                <p className="text-white/60 text-lg max-w-[380px]">
                Join our community of over 10 million fashion enthusiasts worldwide.
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                    </div>
                ))}
                </div>
                <p className="text-sm font-medium text-white/80">
                Trusted by 10M+ users
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
    );
};

export default AuthHero;
