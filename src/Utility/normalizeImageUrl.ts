/**
 * normalizes backend image URLs so that they dynamically adapt to the
 * environment's REACT_APP_API_URL host. This is crucial for local dev images
 * (stored with localhost:5160 base URL) when displayed on production or remote clients.
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';

  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  const baseUrl = process.env.REACT_APP_API_URL || '';
  const hostUrl = baseUrl.endsWith('/api')
    ? baseUrl.slice(0, -4)
    : baseUrl.endsWith('/api/')
      ? baseUrl.slice(0, -5)
      : baseUrl;

  // Handle absolute URL that contains /api/Image/
  const apiMarker = '/api/Image/';
  const index = url.indexOf(apiMarker);
  if (index !== -1) {
    return `${hostUrl}${apiMarker}${url.substring(index + apiMarker.length)}`;
  }

  // Handle absolute URL that contains /Image/ (just in case)
  const imageMarker = '/Image/';
  const imgIndex = url.indexOf(imageMarker);
  if (imgIndex !== -1) {
    return `${hostUrl}${apiMarker}${url.substring(imgIndex + imageMarker.length)}`;
  }

  // Any other absolute URL is left untouched (e.g. LINE profile pictures)
  if (url.startsWith('http')) return url;

  // Handle relative path (e.g. "news/2026/06/filename.jpg" or "/uploads/...")
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${hostUrl}/${cleanUrl}`;
};
