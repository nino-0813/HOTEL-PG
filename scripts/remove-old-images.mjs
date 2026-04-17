/**
 * WebP変換後の元画像（jpg, png, jpeg）を削除
 * 実行前に convert-to-webp.mjs を実行しておくこと
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

function getAllImageFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.')) {
      getAllImageFiles(fullPath, files);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const files = getAllImageFiles(imagesDir);
let removed = 0;
for (const file of files) {
  try {
    fs.unlinkSync(file);
    console.log('Removed:', path.relative(imagesDir, file));
    removed++;
  } catch (err) {
    console.error('Failed to remove:', file, err.message);
  }
}
console.log(`\nRemoved ${removed} old image files.`);
