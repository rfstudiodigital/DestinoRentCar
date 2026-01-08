// Script para generar íconos PWA
// Nota: Este script requiere sharp. Instalar con: npm install --save-dev sharp
// Para generar los íconos, necesitarás una imagen fuente logo.png en public/

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const sizes = [192, 512];
  const publicDir = path.join(process.cwd(), 'public');
  const logoPath = path.join(publicDir, 'logo.png');

  if (!fs.existsSync(logoPath)) {
    console.log('⚠️  logo.png no encontrado. Creando íconos desde logo.svg...');
    // Crear íconos básicos desde el SVG
    return;
  }

  for (const size of sizes) {
    try {
      await sharp(logoPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Generado icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error);
    }
  }
}

generateIcons();

