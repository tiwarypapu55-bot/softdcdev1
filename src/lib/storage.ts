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
export const downloadFile = async (url: string, fileName: string) => {
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
    // Handlers for default sample URL placeholders or missing target URLs
    if (url.includes('stginstitute.in/prospectus.pdf') || url === '#' || !url) {
      downloadFallbackPdf(fileName || 'Prospectus.pdf');
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Failed to download remote file via Fetch blob, falling back to dynamic PDF preview:', e);
      // Use dynamic PDF fallback if remote server blocks CORS or file does not exist (404)
      if (url.endsWith('.pdf') || url.includes('prospectus')) {
        downloadFallbackPdf(fileName || 'Prospectus.pdf');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
};

/**
 * Generates a clean, valid minimalist client-side PDF document dynamically to 
 * avoid any potential 404/broken link issues with default school assets.
 */
export const downloadFallbackPdf = (fileName: string) => {
  const content = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj
4 0 obj << /Length 380 >> stream
BT
/F1 20 Tf 50 750 Td (SOFTDEV TALLY GURU) Tj
/F2 12 Tf 0 -40 Td (Welcome to the Student Zone Prospectus!) Tj
0 -25 Td (This is the default prospectus placeholder document.) Tj
0 -25 Td (Please upload your custom prospectus PDF via the Admin Panel) Tj
0 -15 Td (at the Business Profile page, and it will be instantly active.) Tj
0 -40 Td (Center Name: SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN) Tj
0 -20 Td (Email: info@stginstitute.in / Phone: +91 9450455378) Tj
0 -20 Td (Website: www.stginstitute.in) Tj
ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000015 00000 n
0000000063 00000 n
0000000115 00000 n
0000000300 00000 n
trailer << /Size 5 /Root 1 0 R >>
startxref
700
%%EOF`;

  const blob = new Blob([content], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

