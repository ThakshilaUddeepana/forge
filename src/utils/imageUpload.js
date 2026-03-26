
/**
 * Uploads a file or blob to Cloudinary.
 * @param {File|Blob} file - The file or blob to upload.
 * @param {string} [publicId] - Optional. If provided, will attempt to use this as the public_id (for overwriting).
 * @param {string} [folder] - Optional. Folder to upload to. Defaults to 'tshirt-originals'.
 * @returns {Promise<string|null>} - The secure URL of the uploaded image, or null on failure.
 */
export const uploadToCloudinary = async (file, publicId, folder = 'tshirt-originals') => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        console.error("Cloudinary configuration missing. Check .env file.");
        return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    if (publicId) {
        formData.append("public_id", publicId);
    }

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary Upload Failed:", data);
            return null;
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};
