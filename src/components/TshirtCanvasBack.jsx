import { CANVAS_CONFIG } from "@/constants/designConstants";
import { useTshirtCanvas } from "@/hooks/useTshirtCanvas";

const TshirtCanvasBack = ({ svgPath }) => {
  const { canvasRef } = useTshirtCanvas({
    svgPath,
    view: "back",
  });

  return (
    <div className="relative" style={{ width: CANVAS_CONFIG.width, height: CANVAS_CONFIG.height }}>
      {/* Dashed A2 boundary */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          border: '2px dashed rgba(255, 165, 0, 0.5)',
          borderRadius: '8px',
        }}
      />
      {/* A2 label */}
      <span
        className="absolute top-2 left-2 text-[10px] text-orange-400/60 font-mono pointer-events-none z-0"
      >
        A2 Print Area
      </span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        width={CANVAS_CONFIG.width}
        height={CANVAS_CONFIG.height}
      />
    </div>
  );
};

export default TshirtCanvasBack;
