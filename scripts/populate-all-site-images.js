const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGETS = [
  // Services Stages (3:2 = 1800x1200)
  {
    dest: 'public/images/services/stage-start.jpg',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Starting Out: Proposals & Scope'
  },
  {
    dest: 'public/images/services/stage-research.jpg',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Doing Research: Data Analysis'
  },
  {
    dest: 'public/images/services/stage-writing.jpg',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Writing Up: Chapter Revisions'
  },
  {
    dest: 'public/images/services/stage-publishing.jpg',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Getting Out: Peer-Reviewed Papers'
  },

  // About, Accelerator, Membership (21:9 = 2520x1080 or 16:9 = 2400x1350)
  {
    dest: 'public/images/about/header.jpg',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'About GradEdge Academic Solutions'
  },
  {
    dest: 'public/images/accelerator/library.jpg',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2600&auto=format&fit=crop',
    width: 2400,
    height: 1350,
    ratio: '16:9',
    label: 'University Research Library'
  },
  {
    dest: 'public/images/membership/header.jpg',
    url: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'GradEdge Research Membership'
  },

  // Subjects (3:2 = 1800x1200)
  {
    dest: 'public/images/subjects/sciences.jpg',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Natural & Agricultural Sciences'
  },
  {
    dest: 'public/images/subjects/humanities.jpg',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Humanities & Philosophy'
  },
  {
    dest: 'public/images/subjects/health.jpg',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Health & Medical Sciences'
  },
  {
    dest: 'public/images/subjects/business.jpg',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Business & Economic Studies'
  },
  {
    dest: 'public/images/subjects/technology.jpg',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Computer Science & IT'
  },
  {
    dest: 'public/images/subjects/education.jpg',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Education & Social Sciences'
  },

  // Blog (21:9 = 2520x1080 or 3:2 = 1800x1200)
  {
    dest: 'public/images/blog/header.jpg',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'GradEdge Academic Blog'
  },
  {
    dest: 'public/images/blog/post-1.jpg',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Research Methods Editorial'
  },
  {
    dest: 'public/images/blog/post-2.jpg',
    url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Supervisor Feedback Editorial'
  },
  {
    dest: 'public/images/blog/post-3.jpg',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2600&auto=format&fit=crop',
    width: 1800,
    height: 1200,
    ratio: '3:2',
    label: 'Dissertation Craft Editorial'
  },

  // Institutional, Resources, Pricing, Contact, FAQ (21:9 = 2520x1080)
  {
    dest: 'public/images/institutions/header.jpg',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'Institutional Partnerships'
  },
  {
    dest: 'public/images/resources/header.jpg',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'Scholarly Research Resources'
  },
  {
    dest: 'public/images/pricing/header.jpg',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'Transparent Research Investment'
  },
  {
    dest: 'public/images/contact/header.jpg',
    url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'Academic Consultation Inquiries'
  },
  {
    dest: 'public/images/faq/header.jpg',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2600&auto=format&fit=crop',
    width: 2520,
    height: 1080,
    ratio: '21:9',
    label: 'Frequently Asked Questions'
  }
];

async function processAll() {
  const results = [];
  console.log(`Starting processing of ${TARGETS.length} platform images...`);

  for (let i = 0; i < TARGETS.length; i++) {
    const item = TARGETS[i];
    const fullPath = path.resolve(process.cwd(), item.dest);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    try {
      console.log(`[${i + 1}/${TARGETS.length}] Fetching ${item.label}...`);
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ${item.url}`);
      }
      const rawBuffer = Buffer.from(await response.arrayBuffer());

      let quality = 80;
      let processed = await sharp(rawBuffer)
        .resize(item.width, item.height, { fit: 'cover', position: 'centre' })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      // Ensure under 400 KB
      while (processed.length > 400 * 1024 && quality > 55) {
        quality -= 5;
        processed = await sharp(rawBuffer)
          .resize(item.width, item.height, { fit: 'cover', position: 'centre' })
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
      }

      fs.writeFileSync(fullPath, processed);
      const sizeKb = (processed.length / 1024).toFixed(1);
      results.push({
        path: item.dest,
        dimensions: `${item.width}x${item.height}`,
        ratio: item.ratio,
        sizeKb: `${sizeKb} KB`,
        qualityUsed: quality,
        status: 'Success'
      });
      console.log(`✓ [${i + 1}/${TARGETS.length}] Saved ${item.dest} (${item.width}x${item.height}, ${sizeKb} KB)`);
    } catch (err) {
      console.error(`✗ Error processing ${item.dest}:`, err.message);
      results.push({
        path: item.dest,
        status: `Failed: ${err.message}`
      });
    }
  }

  return results;
}

processAll().then(res => {
  console.log('\n--- FINAL SUMMARY TABLE ---');
  console.table(res);
}).catch(console.error);

