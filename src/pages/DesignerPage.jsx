import { useDispatch, useSelector } from "react-redux";
import DesignArea from "../components/DesignArea";
import { Toaster } from "@/components/ui/toaster";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { setSelectedView, setTshirtColor } from "../features/tshirtSlice";
import { useCanvas } from "../hooks/useCanvas";
import { TshirtModel } from "../components/TShirtModel";
import { useCanvasTextureSync } from "../hooks/useCanvasTextureSync";
import { Suspense, useRef } from "react";
import { ToolsSidebar } from "../components/ToolsSidebar";
import { DownloadHandler } from "../components/DownloadButton";
import Navbar from "../components/Navbar";

function DesignerPage() {
    const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
    const selectedView = useSelector((state) => state.tshirt.selectedView);
    const dispatch = useDispatch();
    const { frontCanvas, backCanvas } = useCanvas();
    const captureCanvasRef = useRef(null);
    const designAreaRef = useRef(null);

    const selectedType = useSelector((state) => state.tshirt.selectedType);

    const { designTextureFront, designTextureBack, manualTriggerSync } =
        useCanvasTextureSync({
            frontCanvas,
            backCanvas,
            selectedView,
        });

    const manualSync = () => {
        manualTriggerSync(selectedView);
    };

    const handleViewChange = (view) => {
        if (view !== selectedView) {
            dispatch(setSelectedView(view));
        }
    };

    const handleDownload = async () => {
        if (!captureCanvasRef.current) return;

        const originalView = selectedView;

        const downloadImage = (dataURL, filename) => {
            const link = document.createElement("a");
            link.download = filename;
            link.href = dataURL;
            link.click();
        };

        dispatch(setSelectedView("front"));
        await new Promise((resolve) => setTimeout(resolve, 500));
        const frontImage = captureCanvasRef.current();
        downloadImage(frontImage, "tshirt-front.png");

        dispatch(setSelectedView("back"));
        await new Promise((resolve) => setTimeout(resolve, 500));
        const backImage = captureCanvasRef.current();
        downloadImage(backImage, "tshirt-back.png");

        dispatch(setSelectedView(originalView));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
            <div className="bg-[#0a0a0a] border-b border-white/5">
                <Navbar />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <ToolsSidebar manualSync={manualSync} onDownload={handleDownload} />
                <div className="flex-1 overflow-y-auto">
                    <main className="p-3 sm:p-8">
                        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-5 sm:gap-12 items-start justify-center">
                            {/* Left: 3D Model Section */}
                            <div className="flex-1 w-full space-y-3 sm:space-y-6">
                                {/* 3D Model */}
                                <div className="aspect-[4/3] sm:aspect-square w-full relative rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
                                    <Canvas shadows camera={{ position: [0, 0, 18], fov: 15 }}>
                                        <OrbitControls
                                            enabled={false}
                                            maxPolarAngle={Math.PI / 2}
                                            minPolarAngle={Math.PI / 3}
                                        />
                                        <Suspense fallback={null}>
                                            <ambientLight intensity={0.7} />
                                            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
                                            <directionalLight position={[-10, 5, 5]} intensity={0.5} />
                                            <TshirtModel
                                                tshirtColor={tshirtColor}
                                                selectedType={selectedType}
                                                selectedView={selectedView}
                                                onViewChange={handleViewChange}
                                                designTexture={designTextureFront}
                                                designTextureBack={designTextureBack}
                                            />
                                            <Environment preset="city" />
                                            <DownloadHandler
                                                onDownloadReady={(captureFunc) => {
                                                    captureCanvasRef.current = captureFunc;
                                                }}
                                            />
                                        </Suspense>
                                    </Canvas>
                                </div>

                                {/* View Toggles */}
                                <div className="flex justify-center gap-2 sm:gap-4">
                                    <button
                                        className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 ${selectedView === "front"
                                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-95"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                                            }`}
                                        onClick={() => handleViewChange("front")}
                                    >
                                        Front View
                                    </button>
                                    <button
                                        className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 ${selectedView === "back"
                                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-95"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                                            }`}
                                        onClick={() => handleViewChange("back")}
                                    >
                                        Back View
                                    </button>
                                </div>

                                {/* Color Selection — framed section under toggles */}
                                <div className="space-y-3 bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select T-Shirt Color</label>
                                    <div className="flex gap-4 items-center">
                                        <button
                                            onClick={() => dispatch(setTshirtColor("#000000"))}
                                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${tshirtColor === "#000000" ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20' : 'border-white/10'}`}
                                            style={{ backgroundColor: "#000000" }}
                                            title="Black"
                                        />
                                        <button
                                            onClick={() => dispatch(setTshirtColor("#ffffff"))}
                                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${tshirtColor === "#ffffff" || tshirtColor === "#FFFFFF" ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20' : 'border-white/10'}`}
                                            style={{ backgroundColor: "#ffffff" }}
                                            title="White"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Design Area Section */}
                            <div className="w-full lg:w-[500px] sticky top-8">
                                <DesignArea ref={designAreaRef} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default DesignerPage;
