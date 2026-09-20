// Requires cwebp (macOS: brew install webp). Originals remain untouched.
// Keep screenshot dimensions intact so text remains readable in project dialogs.
import { readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../src/assets/', import.meta.url));
let originalBytes = 0;
let optimizedBytes = 0;
let count = 0;

for (const category of ['hero', 'projects']) {
    const directory = path.join(root, category);
    for (const filename of readdirSync(directory)) {
        if (!/\.(png|jpe?g)$/i.test(filename)) continue;
        const source = path.join(directory, filename);
        const destination = source.replace(/\.(png|jpe?g)$/i, '.webp');
        const result = spawnSync('cwebp', ['-quiet', '-q', '85', '-m', '6', source, '-o', destination], { stdio: 'inherit' });
        if (result.error || result.status !== 0) {
            throw result.error || new Error(`WebP conversion failed: ${filename}`);
        }
        originalBytes += statSync(source).size;
        optimizedBytes += statSync(destination).size;
        count++;
    }
}

console.log(`${count} images: ${(originalBytes / 1e6).toFixed(2)} MB → ${(optimizedBytes / 1e6).toFixed(2)} MB (${(100 * (1 - optimizedBytes / originalBytes)).toFixed(1)}% smaller).`);
