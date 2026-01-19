const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Create a simple icon with text
async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#3b82f6"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.5}" 
        font-weight="bold" 
        fill="white">A</text>
    </svg>
  `;

  const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Generated ${outputPath}`);
}

async function generateAllIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    await generateIcon(size);
  }
  
  console.log('✓ All icons generated successfully!');
}

generateAllIcons().catch(console.error);
