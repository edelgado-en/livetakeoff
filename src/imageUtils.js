export const normalizeCloudinaryUrl = (url) => {
  if (!url || !url.includes("/upload/")) return url;
  const withTransform = url.replace("/upload/", "/upload/f_auto,q_auto/");
  return /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(withTransform)
    ? withTransform
    : `${withTransform}.jpg`;
};