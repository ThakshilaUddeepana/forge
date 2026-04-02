import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Palette, Layers, Zap, ShoppingBag, Terminal } from "lucide-react";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/modern-hero.png"
                        alt="Modern Premium T-Shirt"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-16 sm:pt-20">
                    <div className="max-w-3xl space-y-5 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium">
                            <Zap size={14} />
                            <span>Premium Quality Guaranteed</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter">
                            CRAFT YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                IDENTITY
                            </span>
                        </h1>

                        <p className="text-base sm:text-xl text-gray-300 max-w-xl leading-relaxed font-light">
                            Experience the future of custom apparel. Our designer tool gives you complete
                            creative freedom with the highest quality fabrics and printing technology.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
                            <Link
                                to="/customize"
                                className="group flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-5 text-sm sm:text-lg font-bold text-white bg-orange-600 rounded-full hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
                            >
                                CUSTOMIZE T-SHIRTS
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/catalog"
                                className="group flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-5 text-sm sm:text-lg font-bold text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all active:scale-95"
                            >
                                VIEW COLLECTIONS
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-8 pt-8 sm:pt-12 border-t border-white/10">
                            <div>
                                <p className="text-lg sm:text-2xl font-bold">10k+</p>
                                <p className="text-xs sm:text-sm text-gray-500">Happy Customers</p>
                            </div>
                            <div className="w-px h-8 sm:h-10 bg-white/10"></div>
                            <div>
                                <p className="text-lg sm:text-2xl font-bold">24h</p>
                                <p className="text-xs sm:text-sm text-gray-500">Fast Shipping</p>
                            </div>
                            <div className="w-px h-8 sm:h-10 bg-white/10"></div>
                            <div>
                                <p className="text-lg sm:text-2xl font-bold">Premium</p>
                                <p className="text-xs sm:text-sm text-gray-500">Eco-Materials</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-14 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                    <div className="text-center space-y-4 mb-12 sm:mb-20 text-balance">
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">WHY CHOOSE FORGE?</h2>
                        <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
                        {[
                            {
                                icon: <Palette className="text-orange-500" size={32} />,
                                title: "Full Control",
                                desc: "Our 3D designer lets you see every angle of your creation before you buy."
                            },
                            {
                                icon: <Layers className="text-orange-500" size={32} />,
                                title: "Premium Fabric",
                                desc: "We use only the finest 100% organic cotton for maximum comfort and durability.",
                                link: "/materials"
                            },
                            {
                                icon: <ShoppingBag className="text-orange-500" size={32} />,
                                title: "Secure Checkout",
                                desc: "Global shipping with end-to-end tracking and secure payment gateways."
                            }
                        ].map((feature, i) => {
                            const CardWrapper = feature.link ? Link : 'div';
                            return (
                                <CardWrapper key={i} to={feature.link} className={`group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-500 block ${feature.link ? 'cursor-pointer' : ''}`}>
                                    <div className="mb-6 p-4 rounded-2xl bg-orange-500/5 w-fit group-hover:scale-110 group-hover:bg-orange-500/10 transition-all duration-500">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                    {feature.link && (
                                        <div className="mt-6 flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            Learn More <ArrowRight size={14} />
                                        </div>
                                    )}
                                </CardWrapper>
                            );
                        })}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
            </section>

            {/* Footer Tagline */}
            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} FORGE STUDIOS. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default HomePage;
