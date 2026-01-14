
export const uploadToCloudinary = async (file: File): Promise<{ url: string; name: string; size: string }> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const data = await response.json();

    // Format size
    const sizeInBytes = data.bytes;
    let sizeStr = "";
    if (sizeInBytes < 1024) sizeStr = `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) sizeStr = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    else sizeStr = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;

    return {
        url: data.secure_url,
        name: data.original_filename + "." + data.format,
        size: sizeStr
    };
};
