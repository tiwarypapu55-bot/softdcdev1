/**
 * Utility for handling local storage optimizations and image compression
 */

/**
 * Compresses an image to stay within local storage limits
 * @param base64Str The original base64 string
 * @param maxWidth The maximum width for the image
 * @param quality The quality of the compression (0.0 to 1.0)
 * @param format The output format (image/jpeg, image/png, image/webp)
 */
export const compressImage = (
  base64Str: string, 
  maxWidth = 1200, 
  quality = 0.7, 
  format = 'image/webp'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not found'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to requested format. WebP is generally best for web today, 
      // but PNG is needed if transparency MUST be perfect and webp isn't supported (rare now).
      const compressed = canvas.toDataURL(format, quality);
      resolve(compressed);
    };
    img.onerror = (e) => reject(e);
  });
};

/**
 * Checks if a string exceeds a safe local storage limit (e.g., 2MB per item)
 */
export const isTooLarge = (data: string): boolean => {
  // Simple check for string size (~2MB limit per large object is safe)
  return data.length > 2 * 1024 * 1024;
};
