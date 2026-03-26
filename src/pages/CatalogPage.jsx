import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections } from "../features/shopSlice";
import { setSelectedType } from "../features/tshirtSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TITLE_TO_TYPE_MAP = {
    "regular t-shirt": "crew-neck",
    "oversized t-shirt": "oversized",
};

const CatalogPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { collections, isLoading } = useSelector((state) => state.shop);
    const [selectedCollectionId, setSelectedCollectionId] = React.useState(null);

    useEffect(() => {
        dispatch(fetchCollections());
    }, [dispatch]);

    const handleCollectionClick = (id) => {
        setSelectedCollectionId(id);
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.handle}`);
    };

    // Filter collections: Remove "Home page"
    const filteredCollections = collections.filter(c => c.title?.toLowerCase().trim() !== "home page");

    const selectedCollection = collections.find(c => c.id === selectedCollectionId);

    // Filter products: Remove base materials
    const filteredProducts = selectedCollection?.products.filter(p => {
        const title = p.title?.toLowerCase().trim();
        return title !== "regular t-shirt" && title !== "oversized t-shirt";
    }) || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-8 pt-16">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight self-center">
                        {selectedCollection ? (
                            <span className="text-orange-500 uppercase">{selectedCollection.title}</span>
                        ) : (
                            <>PREMIUM <span className="text-orange-500">COLLECTIONS</span></>
                        )}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {selectedCollection
                            ? `Showing products in ${selectedCollection.title}`
                            : "Explore our curated collections of premium apparel."}
                    </p>
                    {selectedCollection && (
                        <Button
                            variant="ghost"
                            className="text-orange-500 hover:text-orange-400 hover:bg-white/5 font-bold"
                            onClick={() => setSelectedCollectionId(null)}
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Collections
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="bg-white/[0.03] border-white/10 overflow-hidden border">
                                <Skeleton className="h-[400px] w-full bg-white/5" />
                                <div className="p-6 space-y-2">
                                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {!selectedCollection ? (
                            // Collections View
                            filteredCollections.map((collection) => (
                                <div
                                    key={collection.id}
                                    className="group cursor-pointer"
                                    onClick={() => handleCollectionClick(collection.id)}
                                >
                                    <Card className="bg-white/[0.03] border-white/10 overflow-hidden h-full border transition-all duration-300 hover:border-orange-500/50 hover:bg-white/[0.05]">
                                        <div className="relative h-[400px] overflow-hidden bg-white/5">
                                            {(collection.image || collection.products?.[0]?.images?.[0]) && (
                                                <img
                                                    src={collection.image?.src || collection.products[0].images[0].src}
                                                    alt={collection.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                                                <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full">
                                                    View Collection <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-6 text-center">
                                            <h3 className="text-xl font-bold uppercase tracking-tight">{collection.title}</h3>
                                            <p className="text-gray-400 text-sm mt-2">{collection.products.length} Products</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            // Products View
                            filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group cursor-pointer"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <Card className="bg-white/[0.03] border-white/10 overflow-hidden h-full border transition-all duration-300 hover:border-orange-500/50 hover:bg-white/[0.05]">
                                            <div className="relative h-[400px] overflow-hidden bg-white/5">
                                                {product.images[0] && (
                                                    <img
                                                        src={product.images[0].src}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                                                    {/* Button removed to simplify catalog view */}
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-orange-500">
                                                        {product.variants[0].price.amount} {product.variants[0].price.currencyCode}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-gray-400 text-lg italic">No products found in this collection (designer materials are filtered out).</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;
