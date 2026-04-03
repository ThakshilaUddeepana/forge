import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addItemToCheckout, fetchProducts, createCheckout } from "../features/shopSlice";
import { useCanvas } from "@/hooks/useCanvas";
import { useEffect, useState, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { uploadToCloudinary } from "@/utils/imageUpload";
import { TSHIRT_TYPES, CANVAS_CONFIG } from "../constants/designConstants";
import TshirtCanvasFront from "./TshirtCanvasFront";
import TshirtCanvasBack from "./TshirtCanvasBack";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ImagePlus, Trash, FlipHorizontal } from "lucide-react";
import { setSelectedView, setTshirtColor, setSelectedSize, setOriginalBackUrl } from "../features/tshirtSlice";
import * as fabric from "fabric";

import { useToast } from "@/hooks/use-toast";

const DesignArea = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { checkout, isLoading, products } = useSelector((state) => state.shop);
  const { tshirtColor, selectedType, selectedView, originalFrontUrl, originalBackUrl, designId, selectedSize } = useSelector((state) => state.tshirt);
  const { frontCanvas, backCanvas, activeCanvas } = useCanvas();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const mobileFileInputRef = useRef(null);
  const { toast } = useToast();

  // Expose addToCart and state to parent via ref
  useImperativeHandle(ref, () => ({
    addToCart,
    isProcessing,
    uploadError,
    isLoading,
  }));

  const getSvgPath = (view) => {
    const tshirtType = TSHIRT_TYPES[selectedType];
    return view === "front" ? tshirtType.frontPath : tshirtType.backPath;
  };

  // Mobile Add Design handler
  const handleMobileAddImage = async (e) => {
    // Determine the target canvas (always back since front is fixed)
    const targetCanvas = backCanvas;
    if (!targetCanvas || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    e.target.value = '';

    // Auto-flip to back view if needed
    if (selectedView === 'front') {
      dispatch(setSelectedView('back'));
    }

    // Upload original to Cloudinary
    const originalUrl = await uploadToCloudinary(file, `original_${designId}_back`, 'tshirt-originals');
    if (originalUrl) dispatch(setOriginalBackUrl(originalUrl));

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target.result;
      // Remove existing images (one image at a time)
      const existingImages = targetCanvas.getObjects().filter(obj => obj.type === 'image');
      existingImages.forEach(img => targetCanvas.remove(img));

      fabric.FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' }).then((img) => {
        const canvasW = targetCanvas.getWidth();
        const canvasH = targetCanvas.getHeight();
        const scale = Math.min(canvasW / img.width, canvasH / img.height) * 0.8;
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvasW - img.width * scale) / 2,
          top: (canvasH - img.height * scale) / 2,
        });
        targetCanvas.add(img);
        targetCanvas.setActiveObject(img);
        targetCanvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const getCanvasBlob = async (canvas) => {
    if (!canvas) return null;
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  // Map selectedType to the exact Shopify product title (case-insensitive match)
  const PRODUCT_TITLE_MAP = {
    "crew-neck": "regular t-shirt",
    "oversized": "oversized t-shirt",
  };

  // Map hex color codes to Shopify variant title keywords
  const COLOR_VARIANT_MAP = {
    "#000000": "black",
    "#FFFFFF": "white",
    "#ffffff": "white",
  };

  const SIZE_OPTIONS = ["S", "M", "L", "XL"];

  const addToCart = async () => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
      return;
    }

    // Must have an original uploaded image
    if (!originalBackUrl) {
      toast({
        title: "No design uploaded",
        description: "Please upload an image to the canvas before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      // --- Step 1: Upload preview (canvas positioned image) to Cloudinary ---
      const backBlob = await getCanvasBlob(backCanvas);
      let previewBackUrl = null;

      if (backBlob) {
        const backPublicId = `preview_${designId}_back`;
        previewBackUrl = await uploadToCloudinary(backBlob, backPublicId, 'tshirt-previews');
      }

      // Enforce BOTH links must exist
      if (!originalBackUrl || !previewBackUrl) {
        const missing = [];
        if (!originalBackUrl) missing.push("Original Image");
        if (!previewBackUrl) missing.push("Preview Image");
        setUploadError(`Failed to upload: ${missing.join(" & ")}`);
        toast({
          title: "Upload Failed",
          description: `Could not upload ${missing.join(" & ")} to cloud storage. Please try again.`,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // --- Step 2: Create fresh checkout ---
      localStorage.removeItem("checkout_id");
      const newCheckoutAction = await dispatch(createCheckout());
      let checkoutId = null;
      if (createCheckout.fulfilled.match(newCheckoutAction)) {
        checkoutId = newCheckoutAction.payload.id;
      }

      // --- Step 3: Find matching Shopify product & variant ---
      const targetTitle = PRODUCT_TITLE_MAP[selectedType] || "";
      const matchedProduct = products.find(
        (p) => p.title?.toLowerCase().trim() === targetTitle.toLowerCase().trim()
      ) || products[0];

      const colorKeyword = COLOR_VARIANT_MAP[tshirtColor] || "";
      const sizeKeyword = selectedSize || "M";
      const matchedVariant = matchedProduct?.variants?.find(
        (v) => {
          const title = v.title?.toLowerCase() || "";
          return title.includes(sizeKeyword.toLowerCase()) && title.includes(colorKeyword.toLowerCase());
        }
      ) || matchedProduct?.variants?.find(
        (v) => v.title?.toLowerCase().includes(colorKeyword.toLowerCase())
      ) || matchedProduct?.variants?.[0];

      console.log(
        `[Cart] type="${selectedType}" → product: "${matchedProduct?.title}" | ` +
        `color="${tshirtColor}" → variant: "${matchedVariant?.title}"`
      );

      const variantId = matchedVariant?.id;
      const colorLabel = matchedVariant?.title || colorKeyword || tshirtColor;
      const typeLabel = TSHIRT_TYPES[selectedType]?.name || selectedType;

      if (variantId && checkoutId) {
        // --- Step 4: Attach BOTH Cloudinary links as custom attributes ---
        const customAttributes = [
          { key: "T-Shirt Type", value: typeLabel },
          { key: "Size", value: selectedSize || "M" },
          { key: "Color", value: colorLabel },
          { key: "Print Size", value: "A2" },
          { key: "Design ID", value: designId },
          { key: "_Original Back", value: originalBackUrl },
          { key: "_Preview Back", value: previewBackUrl },
        ];

        await dispatch(addItemToCheckout({
          checkoutId,
          lineItemsToAdd: [{ variantId, quantity: 1, customAttributes }]
        }));

        toast({
          title: "Added to cart ✓",
          description: "Design uploaded and attached to your order.",
        });
      }
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Upload failed");
      toast({
        title: "Something went wrong",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getScaleFactor = () => {
    if (windowWidth >= 768) return 1;
    const availableWidth = windowWidth - 24; // Less padding for more space
    const baseWidth = 480;
    return Math.min(1, availableWidth / baseWidth);
  };

  const scaleFactor = getScaleFactor();

  // Derive the Shopify variant image URL for the current product + color selection
  const variantImageUrl = useMemo(() => {
    if (!products || products.length === 0) return null;
    const targetTitle = PRODUCT_TITLE_MAP[selectedType] || "";
    const matchedProduct = products.find(
      (p) => p.title?.toLowerCase().trim() === targetTitle.toLowerCase().trim()
    ) || products[0];
    const colorKeyword = COLOR_VARIANT_MAP[tshirtColor] || "";
    const matchedVariant = matchedProduct?.variants?.find(
      (v) => v.title?.toLowerCase().includes(colorKeyword.toLowerCase())
    ) || matchedProduct?.variants?.[0];
    return matchedVariant?.image?.src || null;
  }, [products, selectedType, tshirtColor]);

  const canvasHeight = CANVAS_CONFIG.height;
  const canvasWidth = CANVAS_CONFIG.width;

  return (
    <div className="flex flex-col items-center w-full gap-6">

      {/* Mobile-only Design Tools — horizontally scrollable to prevent cropping */}
      <div className="lg:hidden w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-2 shrink-0">
            <input
              type="file"
              accept="image/*"
              ref={mobileFileInputRef}
              onChange={handleMobileAddImage}
              className="hidden"
            />
            <Button
              onClick={() => mobileFileInputRef.current?.click()}
              className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-3 px-4 flex flex-col items-center gap-1 h-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              <ImagePlus size={16} />
              Add Design
            </Button>
            <Button
              onClick={() => {
                // Trigger download logic from parent if passed via props, or we can handle here.
                // For now, we'll use a placeholder or handle it via a new prop if needed.
                // DesignerPage passes it to ToolsSidebar, we should pass it to DesignArea too.
                if (props.onDownload) props.onDownload();
              }}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex flex-col items-center gap-1 h-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              <ImagePlus size={16} className="rotate-180" />
              Download
            </Button>
            <Button
              onClick={() => {
                if (!activeCanvas) return;
                const obj = activeCanvas.getActiveObject();
                if (obj) {
                  obj.set('flipX', !obj.flipX);
                  activeCanvas.requestRenderAll();
                  activeCanvas.fire('object:modified', { target: obj });
                }
              }}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex flex-col items-center gap-1 h-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              <FlipHorizontal size={16} />
              Mirror
            </Button>
            <Button
              onClick={() => {
                if (!activeCanvas) return;
                const obj = activeCanvas.getActiveObject();
                if (obj) {
                  activeCanvas.remove(obj);
                  activeCanvas.discardActiveObject();
                  activeCanvas.renderAll();
                }
              }}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex flex-col items-center gap-1 h-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              <Trash size={16} />
              Remove
            </Button>
            <Button
              onClick={() => {
                if (!activeCanvas) return;
                activeCanvas.getObjects().forEach((obj) => {
                  if (obj.id !== 'print-area') {
                    activeCanvas.remove(obj);
                  }
                });
                activeCanvas.discardActiveObject();
                activeCanvas.renderAll();
              }}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex flex-col items-center gap-1 h-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              <Trash size={16} />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div
        className="flex justify-center w-full relative transition-all duration-300 ease-in-out px-4"
        style={{
          height: windowWidth < 768 ? `${(canvasHeight + 40) * scaleFactor}px` : 'auto',
          transform: windowWidth < 768 ? `scale(${scaleFactor})` : 'none',
          transformOrigin: 'top center',
          marginBottom: windowWidth < 768 ? `-${(canvasHeight + 40) * (1 - scaleFactor)}px` : '0'
        }}
      >
        <Card className={`bg-white/[0.03] border-white/10 shadow-2xl backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2.5rem] w-fit mx-auto overflow-hidden ${selectedView === 'front' ? 'block' : 'hidden'}`}>
          <CardContent className="p-4 sm:p-8">
            <TshirtCanvasFront svgPath={getSvgPath("front")} />
          </CardContent>
        </Card>

        <Card className={`bg-white/[0.03] border-white/10 shadow-2xl backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2.5rem] w-fit mx-auto overflow-hidden ${selectedView === 'back' ? 'block' : 'hidden'}`}>
          <CardContent className="p-4 sm:p-8">
            <TshirtCanvasBack svgPath={getSvgPath("back")} />
          </CardContent>
        </Card>
      </div>

      {/* Size Chart Button */}
      <div className="w-full px-4 sm:px-0 z-20">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-xl py-4 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs"
            >
              <Ruler size={16} />
              View Size Chart
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl p-4 sm:p-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-center">
              Size <span className="text-orange-500">Chart</span>
            </h2>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img
                src="/size-chart.png"
                alt="Size Chart - Oversized and Regular T-Shirt measurements"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              All measurements in inches. Allow 1-2cm deviation.
            </p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Size Selection */}
      <div className="w-full px-4 sm:px-0 z-20 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Size</label>
        <div className="flex flex-wrap gap-3">
          {SIZE_OPTIONS.map((size) => (
            <Button
              key={size}
              onClick={() => dispatch(setSelectedSize(size))}
              className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${selectedSize === size
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105 border-orange-600"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Buy Now */}
      <div className="w-full flex flex-col gap-2 px-4 sm:px-0 z-20">
        {uploadError && (
          <div className="w-full text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            ⚠️ {uploadError}
          </div>
        )}
        <Button
          size="lg"
          className={`font-bold rounded-2xl active:scale-95 transition-all w-full py-6 text-base ${uploadError
            ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
            : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
            }`}
          onClick={addToCart}
          disabled={isLoading || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading & Processing...
            </div>
          ) : uploadError ? '⟳ Retry' : isLoading ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>
    </div >
  );
});

export default DesignArea;
