import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { closeCart, removeLineItem, updateLineItem, createCheckout, fetchCheckout } from "../features/shopSlice";

const CartDrawer = () => {
    const dispatch = useDispatch();
    const { checkout, isCartOpen, isLoading } = useSelector((state) => state.shop);

    useEffect(() => {
        const checkoutId = localStorage.getItem("checkout_id");
        if (checkoutId && !checkout.id) {
            dispatch(fetchCheckout(checkoutId));
        } else if (!checkoutId && !checkout.id) {
            dispatch(createCheckout());
        }
    }, [dispatch, checkout?.id]);


    const handleRemoveItem = (id) => {
        dispatch(removeLineItem({ checkoutId: checkout.id, lineItemIdsToRemove: [id] }));
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
            <SheetContent className="w-full sm:max-w-md bg-[#0a0a0a] border-white/10 text-white">
                <SheetHeader className="border-b border-white/10 pb-4">
                    <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-orange-500" />
                        Your Cart
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                        {checkout.lineItems?.length > 0 ? (
                            <div className="space-y-6">
                                {checkout.lineItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                            {item.variant?.image?.src && (
                                                <img
                                                    src={item.variant.image.src}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-medium text-white truncate">{item.title}</h4>
                                                <p className="text-sm text-gray-400">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-orange-500 font-bold">
                                                    {item.variant.price.amount} {item.variant.price.currencyCode}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                                <ShoppingBag className="w-16 h-16 text-white/10" />
                                <p className="text-gray-500 text-lg">Your cart is empty</p>
                                <Button
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/5 text-white mt-4"
                                    onClick={() => dispatch(closeCart())}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        )}
                    </ScrollArea>

                    {checkout.lineItems?.length > 0 && (
                        <div className="border-t border-white/10 pt-6 space-y-4 mb-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{checkout.subtotalPrice?.amount} {checkout.subtotalPrice?.currencyCode}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/5">
                                    <span>Total</span>
                                    <span>{checkout.totalPrice?.amount} {checkout.totalPrice?.currencyCode}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full py-6 text-lg font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-xl"
                                onClick={() => window.location.href = checkout.webUrl}
                            >
                                Checkout
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
