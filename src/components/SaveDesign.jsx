import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCanvas } from "@/hooks/useCanvas";

import { useSelector } from "react-redux";

const SaveDesign = () => {
  const { toast } = useToast();
  const { frontCanvas, backCanvas } = useCanvas();
  const { originalFrontUrl, originalBackUrl } = useSelector((state) => state.tshirt);

  const saveCanvasToFile = async (canvas, filename, includeShirt = false) => {
    try {
      if (includeShirt) {
        // Create a temporary canvas to combine t-shirt and design
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Set canvas size to match the t-shirt container size
        const container = canvas.wrapperEl.parentElement;
        tempCanvas.width = container.offsetWidth;
        tempCanvas.height = container.offsetHeight;

        // Draw the t-shirt background (you'll need to adjust this based on your t-shirt image)
        const tshirtImg = container.querySelector("img");
        if (tshirtImg) {
          ctx.drawImage(tshirtImg, 0, 0, tempCanvas.width, tempCanvas.height);
        }

        // Draw the design canvas at its correct position
        const rect = canvas.wrapperEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const x = rect.left - containerRect.left;
        const y = rect.top - containerRect.top;
        ctx.drawImage(canvas.lowerCanvasEl, x, y, canvas.width, canvas.height);

        // Get the data URL from the temporary canvas
        const dataUrl = tempCanvas.toDataURL({
          format: "png",
          quality: 1,
        });

        // Create download link
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Original save functionality for design only
        const dataUrl = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
          width: canvas.width,
          height: canvas.height,
        });

        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return true;
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      return false;
    }
  };

  /* High Resolution Preview Generator */
  const generateHighResPreview = async (view, includeShirt) => {
    let canvas = view === 'front' ? frontCanvas : backCanvas;
    if (!canvas) return null;

    // Hide boundary line
    const boundary = canvas.getObjects().find((obj) => obj.name === "printBoundary");
    if (boundary) {
      boundary.visible = false;
      canvas.renderAll();
    }

    let dataUrl = "";

    if (includeShirt) {
      // Create a temporary canvas to combine t-shirt and design at high res
      // Target width: 3000px
      const targetWidth = 3000;
      const container = canvas.wrapperEl.parentElement;

      // Calculate scale factor
      const scaleFactor = targetWidth / container.offsetWidth;
      const targetHeight = container.offsetHeight * scaleFactor;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const ctx = tempCanvas.getContext("2d");

      // Draw the t-shirt background
      const tshirtImg = container.querySelector("img");
      if (tshirtImg) {
        // We need to draw the image scaled up
        // Note: This might be blurry if source image is small, but it's the best we can do from DOM
        ctx.drawImage(tshirtImg, 0, 0, tempCanvas.width, tempCanvas.height);
      }

      // Draw the design canvas at its correct position
      const rect = canvas.wrapperEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate relative position in the container, then scale up
      const x = (rect.left - containerRect.left) * scaleFactor;
      const y = (rect.top - containerRect.top) * scaleFactor;

      // Generate high-res design
      // Multiplier for canvas.toDataURL to match the target scale
      // canvas.width is internal dim (450), container.offsetWidth might be different (responsive)
      // But we assume canvas.width/height matches display for simplicity in calculation 
      // OR we just rely on multiplier. 
      // Multiplier = (Canvas Display Width * scaleFactor) / Canvas Internal Width
      // easier: Multiplier = (Canvas Width in High Res) / Canvas Internal Width
      // Canvas Width in High Res = canvas.offsetWidth * scaleFactor? 
      // Let's use the explicit width logic:
      // Design High Res Width = canvas.width * (targetWidth / 450) -- assuming 450 is base

      const designMultiplier = targetWidth / 450; // Approx 6.66

      // We can use toDataURL with multiplier
      const designDataUrl = canvas.toDataURL({
        format: "png",
        multiplier: designMultiplier,
        quality: 1
      });

      // Load design image and draw
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, x, y);
          resolve();
        };
        img.src = designDataUrl;
      });

      dataUrl = tempCanvas.toDataURL({ format: "png", quality: 1 });

    } else {
      // Design Only, 3000px width equivalent? 
      // Or just multiplier 4 as per prompt? 
      // Prompt said: "returns PNG dataURL at multiplier: 4, 3000px width".
      // I will use multiplier calculated for 3000px width for consistency if "High Res".
      const multiplier = 3000 / canvas.width;
      dataUrl = canvas.toDataURL({
        format: "png",
        multiplier: multiplier,
        quality: 1
      });
    }

    // Restore boundary
    if (boundary) {
      boundary.visible = true;
      canvas.renderAll();
    }

    return dataUrl;
  };

  /* Clean Design Generator (Transparent, No Boundary) */
  const generateCleanDesign = (view) => {
    let canvas = view === 'front' ? frontCanvas : backCanvas;
    if (!canvas) return null;

    const boundary = canvas.getObjects().find((obj) => obj.name === "printBoundary");
    if (boundary) {
      boundary.visible = false;
      canvas.renderAll();
    }

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 4,
      quality: 1
    });

    if (boundary) {
      boundary.visible = true;
      canvas.renderAll();
    }

    return dataUrl;
  };



  const handleSave = async (includeShirt = false) => {
    try {
      if (!frontCanvas && !backCanvas) {
        toast({
          variant: "destructive",
          title: "No Design Found",
          description: "Please create a design before saving.",
          duration: 3000,
        });
        return;
      }

      let savedCount = 0;
      let failedCount = 0;

      // Existing Save Logic (Download)
      if (frontCanvas) {
        const frontSaved = await saveCanvasToFile(frontCanvas, `tshirt-front-${includeShirt ? "with-shirt" : "design-only"}.png`, includeShirt);
        frontSaved ? savedCount++ : failedCount++;
      }
      if (backCanvas) {
        const backSaved = await saveCanvasToFile(backCanvas, `tshirt-back-${includeShirt ? "with-shirt" : "design-only"}.png`, includeShirt);
        backSaved ? savedCount++ : failedCount++;
      }

      // Generate Assets for Return
      console.log("Generating High Res & Clean Assets...");

      const frontPreview = frontCanvas ? await generateHighResPreview('front', true) : null;
      const backPreview = backCanvas ? await generateHighResPreview('back', true) : null;

      const frontClean = frontCanvas ? generateCleanDesign('front') : null;
      const backClean = backCanvas ? generateCleanDesign('back') : null;

      // We need to access Redux state here. 
      // Since I can't hook inside this function, I should pull it at component level.

      const result = {
        frontPreview,
        backPreview,
        frontClean,
        backClean,
        originalFront: originalFrontUrl || null,
        originalBack: originalBackUrl || null
      };

      console.log("Generated Assets:", result);

      if (failedCount > 0) {
        toast({
          variant: "destructive",
          title: "Save Error",
          description: `Failed to save ${failedCount} file(s).`,
        });
      } else {
        toast({
          title: "Design Saved!",
          description: "Files downloaded and assets generated.",
        });
      }

      return result;

    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "An unexpected error occurred while saving.",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleSave(true)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
    </div>
  );
};

export default SaveDesign;
