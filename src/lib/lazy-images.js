// data-src holds root-relative paths that Vite's `base` does not rewrite, so resolve them here.
export const loadLazyImages = (root) => {
  root.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = `${import.meta.env.BASE_URL}${img.dataset.src.replace(/^\//, '')}`;
    img.removeAttribute('data-src');
  });
};
