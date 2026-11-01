const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Image processing configuration as requested:
 * Sizes: 4:5 = 1600x2000, 16:9 = 2400x1350, 3:2 = 1800x1200, 4:3 = 1800x1350, 21:9 = 2520x1080
 * Quality: 80, JPG, under 400 KB
 */
const TARGET_CONFIGS = {
  hero: {
    targetRelPath: 'public/images/home/hero.jpg',
    width: 1600,
    height: 2000,
    ratio: '4:5',
  },
  stuck: {
    targetRelPath: 'public/images/home/stuck.jpg',
    width: 2400,
    height: 1350,
    ratio: '16:9',
  },
  'how-we-work': {
    targetRelPath: 'public/images/home/how-we-work.jpg',
    width: 1800,
    height: 1200,
    ratio: '3:2',
  },
  integrity: {
    targetRelPath: 'public/images/home/integrity.jpg',
    width: 1800,
    height: 1350,
    ratio: '4:3',
  },
  cta: {
    targetRelPath: 'public/images/home/cta.jpg',
    width: 2520,
    height: 1080,
    ratio: '21:9',
  },
};

async function processImage(inputPath, key) {
  const cfg = TARGET_CONFIGS[key];
  if (!cfg) throw new Error(`Unknown config key: ${key}`);

  const destPath = path.resolve(process.cwd(), cfg.targetRelPath);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  let quality = 80;
  let buffer = await sharp(inputPath)
    .resize(cfg.width, cfg.height, {
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  // Ensure file is strictly under 400 KB (409600 bytes)
  while (buffer.length > 400 * 1024 && quality > 60) {
    quality -= 5;
    buffer = await sharp(inputPath)
      .resize(cfg.width, cfg.height, {
        fit: 'cover',
        position: 'centre',
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  fs.writeFileSync(destPath, buffer);
  const metadata = await sharp(destPath).metadata();
  const stats = fs.statSync(destPath);
  const kb = (stats.size / 1024).toFixed(1);

  return {
    key,
    destPath: cfg.targetRelPath,
    dimensions: `${metadata.width}x${metadata.height}`,
    ratio: cfg.ratio,
    sizeKb: kb,
    qualityUsed: quality,
  };
}

module.exports = { processImage, TARGET_CONFIGS };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const [key, inputPath] = args;
    processImage(inputPath, key).then(res => {
      console.log(JSON.stringify(res, null, 2));
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  }
}

