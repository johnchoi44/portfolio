// Eagerly import all images from asset folders using Vite's glob
const historyImages = import.meta.glob('/src/assets/history/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const projectImages = import.meta.glob('/src/assets/projects/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const navImages = import.meta.glob('/src/assets/nav/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const heroImages = import.meta.glob('/src/assets/hero/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const allImages = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });

// Build lookup maps: { "nittanyai": "/assets/NittanyAI-abc123.png" }
const buildImageMap = (globResult) => {
  const map = {};
  for (const [path, module] of Object.entries(globResult)) {
    const filename = path.split('/').pop();
    const key = filename.substring(0, filename.lastIndexOf('.')).toLowerCase();
    map[key] = module.default;
  }
  return map;
};

// Build path-based lookup: { "nav/menuIcon.png": "/assets/menuIcon-abc123.png" }
const buildPathMap = (globResult) => {
  const map = {};
  for (const [path, module] of Object.entries(globResult)) {
    // Convert "/src/assets/nav/menuIcon.png" to "nav/menuIcon.png"
    const relativePath = path.replace('/src/assets/', '');
    map[relativePath] = module.default;
  }
  return map;
};

export const historyImageMap = buildImageMap(historyImages);
export const projectImageMap = buildImageMap(projectImages);
export const navImageMap = buildImageMap(navImages);
export const heroImageMap = buildImageMap(heroImages);
const pathMap = buildPathMap(allImages);

export const resolveImage = (imageKey, category) => {
  if (!imageKey) return null;
  const key = imageKey.toLowerCase();

  if (category === 'history') return historyImageMap[key] || null;
  if (category === 'projects') return projectImageMap[key] || null;
  if (category === 'nav') return navImageMap[key] || null;
  if (category === 'hero') return heroImageMap[key] || null;

  // Fallback: try all
  return projectImageMap[key] || historyImageMap[key] || navImageMap[key] || heroImageMap[key] || null;
};

// Legacy getImageUrl function for components using path-based lookups
export const getImageUrl = (path) => {
  if (!path) return '';
  return pathMap[path] || '';
};
