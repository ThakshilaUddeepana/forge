import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../features/shopSlice";
import { Button } from "./ui/button";
import { ShoppingCart, Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
    const { checkout } = useSelector((state) => state.shop);
    const dispatch = useDispatch();

    const cartItemCount = checkout?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full relative z-50">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-400 -ml-2"
                        >
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#0a0a0a] border-white/5 text-white w-[280px]">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-orange-500 font-black tracking-tighter uppercase text-2xl">Forge</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 mt-12">
                            <Link to="/catalog" className="text-lg font-medium text-gray-400 hover:text-white transition-colors">Catalog</Link>
                            <Link to="/materials" className="text-lg font-medium text-gray-400 hover:text-white transition-colors">Materials</Link>
                            <Link to="/size-chart" className="text-lg font-medium text-gray-400 hover:text-white transition-colors">Size Chart</Link>
                        </div>
                    </SheetContent>
                </Sheet>
                <Link to="/" className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tighter uppercase leading-none">
                    Forge
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8 mr-4">
                    <Link to="/catalog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Catalog</Link>
                    <Link to="/materials" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Materials</Link>
                    <Link to="/size-chart" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Size Chart</Link>
                </div>


                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-400 hover:text-white hover:bg-white/5 h-10 w-10 sm:h-auto sm:w-auto"
                    onClick={() => dispatch(toggleCart())}
                >
                    <ShoppingCart size={window.innerWidth < 640 ? 22 : 20} />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                            {cartItemCount}
                        </span>
                    )}
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
