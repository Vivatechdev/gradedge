const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const images = [
  { file: "public/images/home/hero.jpg", width: 800, height: 1000, label: "Hero Desk & Manuscript (4:5)" },
  { file: "public/images/home/stuck.jpg", width: 1200, height: 675, label: "Analysis Bottleneck Desk (16:9)" },
  { file: "public/images/home/how-we-work.jpg", width: 1200, height: 800, label: "Annotated Chapter & Strategy (3:2)" },
  { file: "public/images/home/integrity.jpg", width: 800, height: 600, label: "Margin Notes Close-up (4:3)" },
  { file: "public/images/home/cta.jpg", width: 1200, height: 675, label: "Library Consultation Desk (16:9)" },
  
  { file: "public/images/services/stage-start.jpg", width: 1200, height: 800, label: "Starting Out: Proposals & Scope (3:2)" },
  { file: "public/images/services/stage-research.jpg", width: 1200, height: 800, label: "Doing Research: Data Analysis (3:2)" },
  { file: "public/images/services/stage-writing.jpg", width: 1200, height: 800, label: "Writing Up: Chapter Revisions (3:2)" },
  { file: "public/images/services/stage-publishing.jpg", width: 1200, height: 800, label: "Getting Out: Peer-Reviewed Papers (3:2)" },

  { file: "public/images/about/header.jpg", width: 1400, height: 600, label: "About GradEdge Academic Solutions (21:9)" },
  { file: "public/images/accelerator/library.jpg", width: 1200, height: 675, label: "University Research Library (16:9)" },
  { file: "public/images/membership/header.jpg", width: 1400, height: 600, label: "GradEdge Research Membership (21:9)" },

  { file: "public/images/subjects/sciences.jpg", width: 1200, height: 800, label: "Natural & Agricultural Sciences (3:2)" },
  { file: "public/images/subjects/humanities.jpg", width: 1200, height: 800, label: "Humanities & Philosophy (3:2)" },
  { file: "public/images/subjects/health.jpg", width: 1200, height: 800, label: "Health & Medical Sciences (3:2)" },
  { file: "public/images/subjects/business.jpg", width: 1200, height: 800, label: "Business & Economic Studies (3:2)" },
  { file: "public/images/subjects/technology.jpg", width: 1200, height: 800, label: "Computer Science & IT (3:2)" },
  { file: "public/images/subjects/education.jpg", width: 1200, height: 800, label: "Education & Social Sciences (3:2)" },

  { file: "public/images/blog/header.jpg", width: 1400, height: 600, label: "GradEdge Academic Blog (21:9)" },
  { file: "public/images/blog/post-1.jpg", width: 1200, height: 800, label: "Research Methods Editorial (3:2)" },
  { file: "public/images/blog/post-2.jpg", width: 1200, height: 800, label: "Supervisor Feedback Editorial (3:2)" },
  { file: "public/images/blog/post-3.jpg", width: 1200, height: 800, label: "Dissertation Craft Editorial (3:2)" },

  { file: "public/images/institutions/header.jpg", width: 1400, height: 600, label: "Institutional Partnerships (21:9)" },
  { file: "public/images/resources/header.jpg", width: 1400, height: 600, label: "Scholarly Research Resources (21:9)" },
  { file: "public/images/pricing/header.jpg", width: 1400, height: 600, label: "Transparent Research Investment (21:9)" },
  { file: "public/images/contact/header.jpg", width: 1400, height: 600, label: "Academic Consultation Inquiries (21:9)" },
  { file: "public/images/faq/header.jpg", width: 1400, height: 600, label: "Frequently Asked Questions (21:9)" },
];

async function generate() {
  for (const img of images) {
    const fullPath = path.resolve(process.cwd(), img.file);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const cleanLabel = img.label.replace(/&/g, "&amp;");
    const svg = `
      <svg width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${img.width}" height="${img.height}" fill="#E4DFD5"/>
        <rect x="20" y="20" width="${img.width - 40}" height="${img.height - 40}" fill="none" stroke="#C8963E" stroke-width="2" stroke-opacity="0.3"/>
        <text x="50%" y="48%" font-family="Georgia, serif" font-size="${Math.round(img.width / 32)}px" fill="#14263F" text-anchor="middle" font-weight="bold">${cleanLabel}</text>
        <text x="50%" y="54%" font-family="sans-serif" font-size="${Math.round(img.width / 50)}px" fill="#555555" text-anchor="middle">GradEdge Editorial Photography Placeholder</text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(fullPath);

    console.log(`✓ Created ${img.file}`);
  }
  console.log("All placeholder images generated cleanly.");
}

generate().catch(console.error);
