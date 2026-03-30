/**
 * public/images 内の全画像をWebPに変換するスクリプト
 * 既に.webpのファイルはスキップ
 */
import sharp from 'sharp';
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

async function convertToWebP(inputPath) {
  const ext = path.extname(inputPath);
  const dir = path.dirname(inputPath);
  const base = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${base}.webp`);

  if (inputPath === outputPath) return null;

  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`✓ ${path.relative(imagesDir, inputPath)} → ${path.basename(outputPath)}`);
    return outputPath;
  } catch (err) {
    console.error(`✗ Failed: ${inputPath}`, err.message);
    return null;
  }
}

async function main() {
  console.log('Converting images to WebP...\n');
  const files = getAllImageFiles(imagesDir);
  console.log(`Found ${files.length} images to convert\n`);

  let converted = 0;
  for (const file of files) {
    const result = await convertToWebP(file);
    if (result) converted++;
  }

  console.log(`\nDone. Converted ${converted} images.`);
}

main().catch(console.error);
