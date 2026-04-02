import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByHandle, fetchProductById, addItemToCheckout } from "../features/shopSlice";
import { setSelectedType } from "../features/tshirtSlice";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    ShoppingCart,
    Maximize2,
    ChevronRight,
    Star,
    ShieldCheck,
    Truck,
    Info
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const ProductDetailsPage = () => {
    const params = useParams();
    const handleOrId = params["*"];
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProduct, isLoading, checkout } = useSelector((state) => state.shop);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (handleOrId) {
            // Shopify GIDs often contain 'gid://' - if it's in the param, we use fetchProductById
            // Note: React Router might have collapsed gid:// to gid:/
            if (handleOrId.includes("gid:/")) {
                dispatch(fetchProductById(handleOrId));
            } else {
                dispatch(fetchProductByHandle(handleOrId));
            }
        }
    }, [handleOrId, dispatch]);

    useEffect(() => {
        if (selectedProduct && selectedProduct.variants.length > 0) {
            setSelectedVariant(selectedProduct.variants[0]);
        }
    }, [selectedProduct]);

    const handleAddToCart = () => {
        if (selectedVariant && checkout.id) {
            dispatch(addItemToCheckout({
                checkoutId: checkout.id,
                lineItemsToAdd: [{ variantId: selectedVariant.id, quantity: 1 }]
            }));
        }
    };


    if (isLoading || !selectedProduct) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-8 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-[600px] w-full bg-white/5 rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4 bg-white/5" />
                        <Skeleton className="h-6 w-1/4 bg-white/5" />
                        <Skeleton className="h-32 w-full bg-white/5" />
                        <Skeleton className="h-12 w-full bg-white/5" />
                    </div>
                </div>
            </div>
        );
    }

    const price = selectedVariant?.price || selectedProduct.variants[0]?.price;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button>
                    <ChevronRight className="w-4 h-4" />
                    <button onClick={() => navigate("/catalog")} className="hover:text-white transition-colors">Catalog</button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-orange-500 font-medium truncate">{selectedProduct.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 xl:gap-20">
                    {/* Left Side: Product Images */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="relative group">
                            <Card className="bg-white/[0.03] border-white/10 overflow-hidden border-2 aspect-square relative flex items-center justify-center">
                                {selectedProduct.images.length > 0 ? (
                                    <img
                                        src={selectedProduct.images[activeImage].src}
                                        alt={selectedProduct.title}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-gray-500 flex flex-col items-center">
                                        <Info className="w-12 h-12 mb-2" />
                                        <span>No image available</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <div className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">PREMIUM</div>
                                </div>
                            </Card>
                        </div>

                        {/* Thumbnail Gallery */}
                        {selectedProduct.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {selectedProduct.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? "border-orange-500 ring-2 ring-orange-500/20" : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Product Details */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-8">
                            <div>
                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 uppercase italic">
                                    {selectedProduct.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 !== 0 ? "text-orange-500" : ""}>{word} </span>
                                    ))}
                                </h1>
                                <p className="text-lg sm:text-2xl font-bold text-gray-300">
                                    {price ? `${price.amount} ${price.currencyCode}` : "Price unavailable"}
                                </p>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="w-full max-w-md rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2 mb-2">
                                        <img src="/size-chart.png" alt="Size Chart" className="w-full h-auto object-contain rounded-lg" />
                                    </div>
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Select Variant</label>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProduct.variants.map((variant) => (
                                            <Button
                                                key={variant.id}
                                                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${selectedVariant?.id === variant.id
                                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105 border-orange-600"
                                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                                                    }`}
                                            >
                                                {variant.title}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        className="h-14 sm:h-16 bg-orange-600 text-white hover:bg-orange-500 font-black text-base sm:text-xl uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-3 w-full"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        <span>Add to Cart</span>
                                    </Button>
                                    <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center space-x-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>Secure Checkout with Shopify</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Description</h3>
                                <div
                                    className="text-gray-400 leading-relaxed prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                                />
                            </div>
                        </div>

                        {/* Extra Info Cards */}
                        <div className="mt-12 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start space-x-3">
                                <Truck className="w-5 h-5 text-orange-500 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-tighter text-white">Fast Shipping</h4>
                                    <p className="text-[10px] text-gray-500">2-5 Business Days</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start space-x-3">
                                <ShieldCheck className="w-5 h-5 text-orange-500 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-tighter text-white">Top Quality</h4>
                                    <p className="text-[10px] text-gray-500">Premium Fabrics</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
