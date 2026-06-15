/**
 * Client-side image compression. Downscales to a max dimension and re-encodes
 * as JPEG to keep uploads (and Cloudinary storage) small.
 */

export function compressDataUrl(dataUrl: string, maxDim = 1280, quality = 0.55): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      // Flatten transparency onto white (JPEG has no alpha).
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = dataUrl;
  });
}

export function compressImageFile(file: File, maxDim = 1280, quality = 0.55): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      compressDataUrl(reader.result as string, maxDim, quality).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/** Profile avatars — smaller dimensions than KYC / document uploads. */
export async function compressProfileImage(file: File): Promise<File> {
  const dataUrl = await compressImageFile(file, 512, 0.7);
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'profile';
  return dataUrlToFile(dataUrl, `${baseName}.jpg`);
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}
