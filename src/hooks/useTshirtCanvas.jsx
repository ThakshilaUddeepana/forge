import { useCallback, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { CANVAS_CONFIG, PRINT_AREA } from "../constants/designConstants";
import { useDispatch, useSelector } from "react-redux";
import { useCanvas } from "@/hooks/useCanvas";
import canvasStorageManager from "@/utils/canvasStorageManager";
import { canvasSyncManager } from "@/utils/canvasSyncManager";

export const useTshirtCanvas = ({ svgPath, view, onDesignUpdate }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();

  const { setActiveCanvas, setSelectedObject, setFrontCanvas, setBackCanvas } =
    useCanvas();

  // Function to save canvas objects
  const saveCanvas = () => {
    if (fabricCanvasRef.current) {
      canvasStorageManager.saveCanvasObjects(view, fabricCanvasRef.current);
    }
  };

  // Function to notify design changes
  const notifyDesignChange = useCallback(() => {
    if (fabricCanvasRef.current && onDesignUpdate) {
      const textureDataUrl = canvasSyncManager.getCanvasTexture(
        fabricCanvasRef.current
      );
      onDesignUpdate(textureDataUrl);
    }
  }, [onDesignUpdate]);

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      ...CANVAS_CONFIG,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    if (view === "front") setFrontCanvas(canvas);
    if (view === "back") setBackCanvas(canvas);

    if (selectedView === view) {
      setActiveCanvas(canvas);
    }

    // Clear any previously saved canvas data so canvas always starts empty
    canvasStorageManager.clearCanvasStorage(view);

    // Handle Object Selection
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Listen for any changes on the canvas
    canvas.on("object:modified", notifyDesignChange);
    canvas.on("object:added", notifyDesignChange);
    canvas.on("object:removed", notifyDesignChange);

    // Movement and scaling handlers
    const handleObjectMoving = (e) => {
      const obj = e.target;
      if (obj === boundaryRef.current) return;
      constrainObjectToArea(obj, "move");
    };

    const handleObjectScaling = (e) => {
      const obj = e.target;
      if (obj === boundaryRef.current) return;
      constrainObjectToArea(obj, "scale");
    };

    // Add movement restriction to keep objects within print area
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:scaling", handleObjectScaling);

    // Cleanup
    return () => {
      canvas.off("object:modified", notifyDesignChange);
      canvas.off("object:added", notifyDesignChange);
      canvas.off("object:removed", notifyDesignChange);
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:scaling", handleObjectScaling);
      canvas.dispose();
      fabricCanvasRef.current = null;
      if (selectedView === view) {
        setActiveCanvas(null);
      }
      setSelectedObject(null);
    };
  }, [dispatch, view, notifyDesignChange]); // Removed printSize dependency

  // Switch Active Canvas When View Changes
  useEffect(() => {
    if (selectedView === view && fabricCanvasRef.current) {
      setActiveCanvas(fabricCanvasRef.current);
    }
  }, [selectedView, dispatch, view]);

  // No SVG clipPath — allow full A2 canvas area for design placement

  // No internal boundary — the dashed border is rendered by the component CSS

  return { canvasRef, fabricCanvasRef, tshirtColor };
};

// Constrain objects within the full A2 canvas area
const constrainObjectToArea = (obj, interactionType = "move") => {
  const areaLeft = 0;
  const areaTop = 0;
  const areaRight = CANVAS_CONFIG.width;
  const areaBottom = CANVAS_CONFIG.height;

  // For scaling, cap if it exceeds canvas dimensions
  if (interactionType === "scale") {
    const bound = obj.getBoundingRect(true);
    let scaleUpdated = false;

    if (bound.width > CANVAS_CONFIG.width) {
      const newScaleX = (CANVAS_CONFIG.width / (bound.width / obj.scaleX)) * 0.999;
      obj.set("scaleX", newScaleX);
      scaleUpdated = true;
    }
    if (bound.height > CANVAS_CONFIG.height) {
      const newScaleY = (CANVAS_CONFIG.height / (bound.height / obj.scaleY)) * 0.999;
      obj.set("scaleY", newScaleY);
      scaleUpdated = true;
    }

    if (scaleUpdated) {
      obj.setCoords();
    }
  }

  // Clamping phase
  const bound = obj.getBoundingRect(true);
  let dx = 0;
  let dy = 0;

  if (bound.left < areaLeft) dx = areaLeft - bound.left;
  else if (bound.left + bound.width > areaRight) dx = areaRight - (bound.left + bound.width);

  if (bound.top < areaTop) dy = areaTop - bound.top;
  else if (bound.top + bound.height > areaBottom) dy = areaBottom - (bound.top + bound.height);

  if (dx !== 0 || dy !== 0) {
    obj.set({
      left: Number((obj.left + dx).toFixed(4)),
      top: Number((obj.top + dy).toFixed(4))
    });
    obj.setCoords();
  }
};

// Helper function to add objects to canvas
// Helper function to add objects to canvas
const addFabricObject = (canvas, objectData) => {
  switch (objectData.type) {
    case "Line":
      canvas.add(
        new fabric.Line(
          [objectData.x1, objectData.y1, objectData.x2, objectData.y2],
          {
            left: objectData.left || 0,
            top: objectData.top || 0,
            stroke: objectData.stroke || "black",
            strokeWidth: objectData.strokeWidth || 2,
            strokeLineCap: objectData.strokeLineCap || "round",
            strokeLineJoin: objectData.strokeLineJoin || "miter",
            opacity: objectData.opacity || 1,
            angle: objectData.angle || 0,
            scaleX: objectData.scaleX || 1,
            scaleY: objectData.scaleY || 1,
          }
        )
      );
      break;
    case "Textbox":
      const textbox = new fabric.Textbox(objectData.text, {
        left: objectData.left,
        top: objectData.top,
        width: objectData.width,
        fontSize: objectData.fontSize,
        fontFamily: objectData.fontFamily,
        textAlign: objectData.textAlign,
        fill: objectData.fill,
        scaleX: objectData.scaleX,
        scaleY: objectData.scaleY,
        angle: objectData.angle,
        opacity: objectData.opacity,
      });

      // Force text re-rendering and positioning
      textbox.initDimensions();
      textbox.set({
        width: textbox.width,
        height: textbox.height,
      });

      canvas.add(textbox);

      // Ensure proper rendering after a short delay

      canvas.renderAll();
      break;
    case "Image":
      if (!objectData.src.startsWith("data:image")) return;
      const imgElement = new Image();
      imgElement.src = objectData.src;
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: objectData.left || 0,
          top: objectData.top || 0,
          scaleX: objectData.scaleX || 1,
          scaleY: objectData.scaleY || 1,
          angle: objectData.angle || 0,
          opacity: objectData.opacity || 1,
        });
        canvas.add(fabricImg);
        canvas.renderAll();
      };
      break;
  }
};
