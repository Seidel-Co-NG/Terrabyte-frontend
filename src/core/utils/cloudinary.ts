/**
 * Upload image to Cloudinary (unsigned upload).
 * Returns the secure_url for the uploaded image.
 */
import { apiConfig } from '../config/api.config';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { cloudName, uploadPreset } = apiConfig.cloudinary;
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.error?.message ?? 'Upload failed';
    throw new Error(msg);
  }

  const secureUrl = data?.secure_url;
  if (!secureUrl || typeof secureUrl !== 'string') {
    throw new Error('Invalid Cloudinary response');
  }

  return secureUrl;
}
