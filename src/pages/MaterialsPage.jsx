import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { ChevronRight, ShieldCheck, PaintRoller, Sparkles, Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const MaterialsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent opacity-50"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
                            Premium Materials
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
                            We never compromise on quality. Discover the ultra-premium fabrics and pristine prints that make Forge gear legendary.
                        </p>
                    </div>
                </section>

                {/* 100% Cotton Section */}
                <section className="py-20 border-t border-white/5 bg-[#0f0f0f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full opacity-50"></div>
                                    <img
                                        src="/materials/premium_cotton_frabric_202603201111.png"
                                        alt="Premium Cotton Fabric"
                                        className="relative w-full rounded-3xl shadow-2xl border border-white/10 object-cover aspect-square"
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase tracking-wider text-sm">
                                    <ShieldCheck size={18} />
                                    100% Organic Cotton
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-tight">
                                    Unmatched Comfort & Durability
                                </h2>
                                <p className="text-lg text-gray-400">
                                    Feel the difference the moment you put it on. Our shirts are crafted from heavyweight, 100% organic cotton that provides incredible breathability, softness, and a structured drape that lasts.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-center gap-4 text-gray-300">
                                        <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Sparkles className="text-orange-500 w-5 h-5" /></div>
                                        <span>Pre-shrunk to maintain a perfect fit wash after wash.</span>
                                    </li>
                                    <li className="flex items-center gap-4 text-gray-300">
                                        <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Droplets className="text-orange-500 w-5 h-5" /></div>
                                        <span>Breathable fabric built for all-day comfort.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* A2 Size Feature */}
                <section className="py-20 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-sm">
                                    <PaintRoller size={18} />
                                    Massive Print Area
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-tight">
                                    Customizable A2 Size Backprint
                                </h2>
                                <p className="text-lg text-gray-400">
                                    Don't limit your creativity. Our cutting-edge printing technology supports massive A2 dimensions (16.5 x 23.4 inches) on the back of every shirt, ensuring your designs are bold, vibrant, and impossible to ignore.
                                </p>
                                <div className="pt-6">
                                    <Link to="/customize" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                                        Start Designing <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <img
                                    src="/materials/T-shirts_with_anime_202603201132.jpeg"
                                    alt="A2 Size Backprint"
                                    className="w-full rounded-3xl shadow-2xl border border-white/10 object-cover aspect-[4/3]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="py-24 border-t border-white/5 bg-[#0f0f0f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Fits & Styles</h2>
                            <p className="text-gray-400 text-lg">Available in both Oversized and Regular fits.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <img src="/materials/Oversized_t-shirts_with_202603201127.jpeg" alt="Oversized Fit" className="w-full h-80 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500" />
                            <img src="/materials/White_cotton_t-shirts_202603201135.jpeg" alt="White Cotton" className="w-full h-80 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500" />
                            <img src="/materials/Black_and_white_202603201118.jpeg" alt="Black and White Options" className="w-full h-80 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500" />
                            <img src="/materials/FORGE_t_shirts_202603201120.jpeg" alt="FORGE Style" className="w-full h-80 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500 md:col-span-2 lg:col-span-1" />
                            <img src="/materials/Folded_t_shirts_202603201111.jpeg" alt="Folded T-shirts" className="w-full h-80 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500 md:col-span-2" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MaterialsPage;
