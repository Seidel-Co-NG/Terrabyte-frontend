/**
 * Compress and resize an image file to fixed dimensions before upload.
 * Profile pictures: 400x400 max, JPEG quality 0.85.
 */
const PROFILE_IMAGE_SIZE = 400;
const PROFILE_IMAGE_QUALITY = 0.85;

export async function compressProfileImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      let { width, height } = img;
      if (width > PROFILE_IMAGE_SIZE || height > PROFILE_IMAGE_SIZE) {
        const ratio = Math.min(PROFILE_IMAGE_SIZE / width, PROFILE_IMAGE_SIZE / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          const name = file.name.replace(/\.[^.]+$/, '.jpg') || 'profile.jpg';
          resolve(new File([blob], name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        PROFILE_IMAGE_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
