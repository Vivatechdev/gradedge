const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT_IMG = "C:/Users/user/.gemini/antigravity/brain/6374ae35-4be6-4566-bea6-3cb08775c0dd/.user_uploaded/media_1793795952663_ffb66fb4.jpg";

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  let offset = 6 + 16 * count;
  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(item.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function generateFavicon() {
  console.log("Reading input image:", INPUT_IMG);

  // The artwork has a navy frame centered around x=511.5, y=519.5 with frame box 614x630.
  // Crop a square region of 686x686 centered on the frame:
  const baseSharp = sharp(INPUT_IMG)
    .extract({
      left: 169,
      top: 177,
      width: 686,
      height: 686,
    })
    .ensureAlpha(); // CRITICAL: Ensures color type 6 (RGBA) with 4 channels

  // High-res master PNGs (strictly RGBA)
  const buffer512 = await baseSharp.clone().resize(512, 512).png({ colourType: 'truecolor-alpha' }).toBuffer();
  const buffer180 = await baseSharp.clone().resize(180, 180).png({ colourType: 'truecolor-alpha' }).toBuffer();

  // Multi-resolution favicon sizes strictly in 32-bit RGBA PNG format
  const buffer48 = await baseSharp.clone().resize(48, 48).png({ colourType: 'truecolor-alpha' }).toBuffer();
  const buffer32 = await baseSharp.clone().resize(32, 32).png({ colourType: 'truecolor-alpha' }).toBuffer();
  const buffer16 = await baseSharp.clone().resize(16, 16).png({ colourType: 'truecolor-alpha' }).toBuffer();

  // Create multi-resolution ICO file (16x16, 32x32, 48x48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buffer16 },
    { width: 32, height: 32, buffer: buffer32 },
    { width: 48, height: 48, buffer: buffer48 },
  ]);

  // Destination paths
  const targets = [
    { path: path.resolve("app/favicon.ico"), buffer: icoBuffer, desc: "app/favicon.ico" },
    { path: path.resolve("public/favicon.ico"), buffer: icoBuffer, desc: "public/favicon.ico" },
    { path: path.resolve("app/icon.png"), buffer: buffer512, desc: "app/icon.png (512x512)" },
    { path: path.resolve("public/icon.png"), buffer: buffer512, desc: "public/icon.png (512x512)" },
    { path: path.resolve("app/apple-icon.png"), buffer: buffer180, desc: "app/apple-icon.png (180x180)" },
    { path: path.resolve("public/apple-touch-icon.png"), buffer: buffer180, desc: "public/apple-touch-icon.png (180x180)" },
  ];

  for (const t of targets) {
    fs.writeFileSync(t.path, t.buffer);
    console.log(`[OK] Generated ${t.desc} (${t.buffer.length} bytes)`);
  }

  console.log("\nFavicon generation complete!");
}

generateFavicon().catch((err) => {
  console.error("Failed to generate favicon:", err);
  process.exit(1);
});
