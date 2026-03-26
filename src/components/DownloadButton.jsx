import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Component that provides download functionality for the 3D canvas
 * Must be placed inside the Canvas component to access Three.js context
 */
export function DownloadHandler({ onDownloadReady }) {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        if (onDownloadReady) {
            // Expose the download function to parent
            onDownloadReady(() => captureCanvas());
        }
    }, [gl, scene, camera]);

    const captureCanvas = () => {
        // Render the scene to ensure we get the current state
        gl.render(scene, camera);

        // Get the canvas as a data URL
        const dataURL = gl.domElement.toDataURL("image/png");

        return dataURL;
    };

    // This component doesn't render anything visible
    return null;
}
