const fs = require('fs');
const path = require('path');

const heroB64 = fs.existsSync('section-hero.png') ? fs.readFileSync('section-hero.png').toString('base64') : '';
const stuckB64 = fs.existsSync('section-stuck.png') ? fs.readFileSync('section-stuck.png').toString('base64') : '';
const howB64 = fs.existsSync('section-how-we-work.png') ? fs.readFileSync('section-how-we-work.png').toString('base64') : '';
const integrityB64 = fs.existsSync('section-integrity.png') ? fs.readFileSync('section-integrity.png').toString('base64') : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GradEdge Homepage Photography Live Gallery</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-[#F9F7F2] p-4 text-[#14263F] font-sans antialiased">
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    <!-- Header -->
    <div class="border-b border-[#D8D2C5] pb-4">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-[#B38030] font-semibold">Live Visual Verification</span>
          <h1 class="text-2xl font-serif font-bold text-[#14263F] mt-1">GradEdge Homepage Editorial Photography</h1>
        </div>
        <span class="px-2.5 py-1 text-xs font-medium rounded bg-[#E4DFD5] text-[#14263F]">Server: http://localhost:3000</span>
      </div>
      <p class="text-xs text-[#555555] mt-2">
        Full rendered browser captures from the live website demonstrating the custom Nano Banana Pro editorial photographs in their sections.
      </p>
    </div>

    <!-- 1. Hero -->
    <div class="bg-white p-4 rounded border border-[#D8D2C5] shadow-xs space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[#14263F]">1. Hero Section &bull; Thesis Chapter Desk</span>
        <span class="font-mono text-[#555555]">hero.jpg &bull; 1600 &times; 2000 (4:5) &bull; 235.6 KB</span>
      </div>
      <div class="overflow-hidden rounded border border-[#E4DFD5]">
        <img src="data:image/png;base64,${heroB64}" alt="Hero Section" class="w-full h-auto block" />
      </div>
    </div>

    <!-- 2. Stuck -->
    <div class="bg-white p-4 rounded border border-[#D8D2C5] shadow-xs space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[#14263F]">2. Section 01: Where Researchers Get Stuck &bull; Crumpled Drafts & Lamp</span>
        <span class="font-mono text-[#555555]">stuck.jpg &bull; 2400 &times; 1350 (16:9) &bull; 212.0 KB</span>
      </div>
      <div class="overflow-hidden rounded border border-[#E4DFD5]">
        <img src="data:image/png;base64,${stuckB64}" alt="Stuck Section" class="w-full h-auto block" />
      </div>
    </div>

    <!-- 3. How We Work -->
    <div class="bg-white p-4 rounded border border-[#D8D2C5] shadow-xs space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[#14263F]">3. Section 02: How We Work &bull; Hands on Keyboard & Consultation Call</span>
        <span class="font-mono text-[#555555]">how-we-work.jpg &bull; 1800 &times; 1200 (3:2) &bull; 153.0 KB</span>
      </div>
      <div class="overflow-hidden rounded border border-[#E4DFD5]">
        <img src="data:image/png;base64,${howB64}" alt="How We Work Section" class="w-full h-auto block" />
      </div>
    </div>

    <!-- 4. Academic Integrity -->
    <div class="bg-white p-4 rounded border border-[#D8D2C5] shadow-xs space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[#14263F]">4. Section 03: Academic Integrity &bull; Pencil Macro & Manuscript Review</span>
        <span class="font-mono text-[#555555]">integrity.jpg &bull; 1800 &times; 1350 (4:3) &bull; 154.3 KB</span>
      </div>
      <div class="overflow-hidden rounded border border-[#E4DFD5]">
        <img src="data:image/png;base64,${integrityB64}" alt="Academic Integrity Section" class="w-full h-auto block" />
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('C:/Users/user/.gemini/antigravity/brain/6374ae35-4be6-4566-bea6-3cb08775c0dd/homepage-images-gallery.html', html);
console.log('Homepage gallery written successfully');

