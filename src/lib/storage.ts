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

/**
 * Traverses and triggers safe downloading of a base64 Data URL or standard HTTP URL
 */
export const downloadFile = (url: string, fileName: string) => {
  if (!url) return;
  
  if (url.startsWith('data:')) {
    try {
      const parts = url.split(';base64,');
      if (parts.length < 2) throw new Error('Invalid base64 URL');
      const contentType = parts[0].split(':')[1] || 'application/octet-stream';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Failed to download base64 file via Blob:', e);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

