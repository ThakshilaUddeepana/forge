import React from "react";
import Navbar from "../components/Navbar";

const SizeChartPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16">
                <div className="text-center space-y-4 mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                        Size <span className="text-orange-500">Chart</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Find your perfect fit. All measurements are in inches.
                    </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] p-4">
                    <img
                        src="/size-chart.png"
                        alt="Size Chart - Oversized and Regular T-Shirt measurements"
                        className="w-full h-auto object-contain rounded-xl"
                    />
                </div>

                <p className="text-center text-xs text-gray-500 mt-6">
                    Allow 1-2cm deviation. All measurements are in inches.
                </p>
            </div>
        </div>
    );
};

export default SizeChartPage;
