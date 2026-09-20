# Portfolio image optimization

Run `npm run optimize:images` after adding or replacing PNG/JPEG images in
`src/assets/hero` or `src/assets/projects`. Install the `cwebp` encoder first
(`brew install webp` on macOS).

The script creates WebP siblings at quality 85 without resizing or modifying
the original images. Commit the generated WebP files alongside any source
changes. Vite imports only WebP and SVG from these two folders so originals
are not included in the deployed build.

Existing extensionless image keys and legacy PNG/JPEG paths continue to resolve
through `src/utils/imageRegistry.js`. Direct imports should use the WebP file.
Other image folders and externally hosted image URLs are unchanged.
