export function optimizeImage(url, width = 800) {
  if (!url) return "";

  // Only optimize Cloudinary images
  if (url.includes("res.cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width}/`
    );
  }

  return url;
}