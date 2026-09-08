/**
 * Cloudinary file upload utility.
 * Supports images (JPEG, PNG, WEBP) and raw documents (PDF, etc.).
 */
export async function uploadToCloudinary(file, options = {}) {
  if (!file) throw new Error('No file provided for upload.');

  const cloudName = options.cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'cebizpay';
  const uploadPreset = options.uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'cebizpay_preset';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  // Use 'auto' resource type to support both images and PDFs/documents
  const resourceType = file.type === 'application/pdf' ? 'auto' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    format: data.format,
    resourceType: data.resource_type,
    bytes: data.bytes,
  };
}
