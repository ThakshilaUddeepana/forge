import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Box, ImagePlus, Palette, Trash, Download, FlipHorizontal } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  CANVAS_CONFIG,
  TSHIRT_TYPES,
  TSHIRT_COLOR_CODES,
  PRINT_AREA,
} from "../constants/designConstants";

import { setSelectedType, setTshirtColor, setOriginalFrontUrl, setOriginalBackUrl, setSelectedView } from "../features/tshirtSlice";
import { useRef, useState, useEffect } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import canvasStorageManager from "@/utils/canvasStorageManager";
import { uploadToCloudinary } from "@/utils/imageUpload";

const ToolBar = ({ manualSync, onDownload }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const { activeCanvas, backCanvas, selectedObject } = useCanvas();
  // We need to know which view is active to set the correct URL in Redux
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const traverse = (obj) => {
    // Dummy function just to keep the line counts similar if needed, or we can just ignore. 
  }

  const handleColorChange = (color) => {
    dispatch(setTshirtColor(color));
  };

  const handlePrintSizeChange = (value) => {
    dispatch(setPrintSize(value));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /* Cloudinary Upload Logic with Session ID */
  const designId = useSelector((state) => state.tshirt.designId);

  const handleAddImage = async (e) => {
    if (!backCanvas || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Auto-flip to back view if needed
    if (selectedView === 'front') {
      dispatch(setSelectedView('back'));
    }

    // Upload to Cloudinary with deterministic ID to allow overwriting
    // Naming convention: original_{designId}_front (or back)
    const publicId = `original_${designId}_${selectedView}`;

    console.log(`Starting upload for ${publicId}...`);

    // Non-blocking upload (fire and forget, but update state when done)
    uploadToCloudinary(file, publicId, 'tshirt-originals').then((url) => {
      if (url) {
        console.log("Uploaded Original Image:", url);
        import("../features/tshirtSlice").then(({ setOriginalBackUrl }) => {
          dispatch(setOriginalBackUrl(url));
        });
      }
    });


    const reader = new FileReader();

    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target.result;

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj);

        // Calculate scaling to fit within print boundary (only for back view as front is fixed)
        const printArea = PRINT_AREA;
        const maxWidth = printArea.width;
        const maxHeight = printArea.height;

        if (image.width > maxWidth || image.height > maxHeight) {
          const scale = Math.min(
            maxWidth / image.width,
            maxHeight / image.height
          );
          image.scale(scale);
        }

        // Center the image
        image.set({
          left: (backCanvas.width - image.getScaledWidth()) / 2,
          top: (backCanvas.height - image.getScaledHeight()) / 2,
        });

        // Remove all existing images before adding the new one (one image at a time)
        const existingImages = backCanvas.getObjects('image');
        existingImages.forEach((img) => backCanvas.remove(img));

        backCanvas.add(image);
        backCanvas.setActiveObject(image);
        backCanvas.renderAll();
        manualSync();
      };
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDelete = () => {
    if (!activeCanvas || !selectedObject) return;
    activeCanvas.remove(selectedObject);
    activeCanvas.discardActiveObject();
    activeCanvas.renderAll();
    manualSync();
  };

  // Handle mirroring selected object
  const handleMirror = () => {
    if (selectedObject && activeCanvas) {
      selectedObject.set('flipX', !selectedObject.flipX);
      activeCanvas.requestRenderAll();
      manualSync(); // Sync changes to Redux/storage
    }
  };

  const handleClearAll = () => {
    if (!activeCanvas) return;
    activeCanvas.clear();
    manualSync();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Separator className="bg-white/5" />

      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAddImage}
          className="hidden"
        />
        <Button
          onClick={triggerFileInput}
          className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-4 sm:py-6 flex flex-col items-center gap-1 h-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ImagePlus size={windowWidth < 550 ? 18 : 20} />
          <span className="text-[10px] sm:text-[10px] font-bold uppercase tracking-widest">Add Design</span>
        </Button>

        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={onDownload}
            disabled={selectedView === 'front'}
            variant="outline"
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-4 sm:py-6 flex flex-col items-center gap-1 h-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={windowWidth < 550 ? 18 : 20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Download Preview</span>
          </Button>
        </div>
      </div>

      <Separator className="bg-white/5" />

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleDelete}
          variant="outline"
          className="h-12 bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 rounded-xl justify-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={!selectedObject || selectedView === 'front'}
        >
          <Trash size={18} />
          <span className="text-sm font-medium">Remove Item</span>
        </Button>
        <Button
          onClick={handleMirror}
          variant="outline"
          className="h-12 bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] rounded-xl justify-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={!selectedObject || selectedView === 'front'}
        >
          <FlipHorizontal size={18} />
          <span className="text-sm font-bold">Mirror Image</span>
        </Button>
        <Button
          onClick={handleClearAll}
          variant="outline"
          className="h-12 bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 rounded-xl justify-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={selectedView === 'front'}
        >
          <Trash size={18} />
          <span className="text-sm font-medium">Clear Canvas</span>
        </Button>
      </div>
    </div >
  );
};

export default ToolBar;
