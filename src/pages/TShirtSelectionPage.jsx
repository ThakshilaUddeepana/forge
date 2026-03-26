import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedType } from "../features/tshirtSlice";
import Navbar from "../components/Navbar";
import { ArrowRight } from "lucide-react";

const options = [
    {
        type: "crew-neck",
        label: "Regular",
        sublabel: "Crew Neck",
        description: "Classic fit with a round crew neckline. Perfect for everyday wear and clean designs.",
        badge: "Most Popular",
        badgeColor: "bg-orange-500",
        preview: (
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Body */}
                <rect x="45" y="70" width="110" height="130" rx="6" fill="currentColor" />
                {/* Left sleeve */}
                <polygon points="45,75 10,110 10,145 45,130" fill="currentColor" />
                {/* Right sleeve */}
                <polygon points="155,75 190,110 190,145 155,130" fill="currentColor" />
                {/* Crew neck */}
                <path d="M75 70 Q100 55 125 70" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                {/* Shoulder seams */}
                <line x1="45" y1="75" x2="75" y2="70" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <line x1="155" y1="75" x2="125" y2="70" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
            </svg>
        ),
    },
    {
        type: "oversized",
        label: "Oversized",
        sublabel: "Drop Shoulder",
        description: "Relaxed, boxy silhouette with dropped shoulders. The ultimate streetwear statement.",
        badge: "Trending",
        badgeColor: "bg-blue-500",
        preview: (
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Body — wider & boxier */}
                <rect x="30" y="80" width="140" height="130" rx="4" fill="currentColor" />
                {/* Left sleeve — dropped & longer */}
                <polygon points="30,80 -5,115 -5,165 30,150" fill="currentColor" />
                {/* Right sleeve — dropped & longer */}
                <polygon points="170,80 205,115 205,165 170,150" fill="currentColor" />
                {/* Relaxed neckline */}
                <path d="M70 80 Q100 62 130 80" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                {/* Shoulder seams */}
                <line x1="30" y1="80" x2="70" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <line x1="170" y1="80" x2="130" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
            </svg>
        ),
    },
];

const TShirtSelectionPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSelect = (type) => {
        dispatch(setSelectedType(type));
        navigate("/design");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white">
            <div className="bg-[#0a0a0a] border-b border-white/5">
                <Navbar />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Step 1 of 1</p>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                        CHOOSE YOUR
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            STYLE
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Select the t-shirt style you want to customize. You can change colors, add graphics and text in the next step.
                    </p>
                    <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {options.map((opt) => (
                        <button
                            key={opt.type}
                            onClick={() => handleSelect(opt.type)}
                            className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/8 hover:border-orange-500/50 hover:bg-white/[0.06] transition-all duration-400 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {/* Badge */}
                            <span className={`absolute top-5 right-5 ${opt.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                {opt.badge}
                            </span>

                            {/* T-Shirt Preview */}
                            <div className="w-48 h-48 text-white/20 group-hover:text-orange-500/40 transition-colors duration-400">
                                {opt.preview}
                            </div>

                            {/* Info */}
                            <div className="w-full space-y-2">
                                <div className="flex items-end gap-2">
                                    <h2 className="text-2xl font-black tracking-tight">{opt.label}</h2>
                                    <span className="text-gray-500 text-sm font-medium pb-0.5">/ {opt.sublabel}</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm">{opt.description}</p>
                            </div>

                            {/* CTA */}
                            <div className="w-full flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                                <span className="text-sm font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Start designing
                                </span>
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300 text-white">
                                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TShirtSelectionPage;
