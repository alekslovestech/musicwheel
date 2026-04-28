//use the old syntax here for the standalone file
const sharp = require("sharp");
const pngToIco = require("png-to-ico");
const fs = require("fs");
const path = require("path");

const sizes: number[] = [16, 32, 48, 64, 128, 256];
const smallSizes: number[] = [16, 32, 48];
const largeSizes: number[] = [64, 128, 256];

async function checkFileExists(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${filePath}`);
  }
}

async function generateIcons(): Promise<void> {
  console.log("🎨 Starting icon generation...");

  const smallSvgPath: string = path.join(__dirname, "../../src/assets/icons/icon_small.svg");
  const largeSvgPath: string = path.join(__dirname, "../../src/assets/icons/icon.svg");
  const publicDir: string = path.join(__dirname, "../../public");

  // Validate source files
  console.log("📂 Checking source files...");
  await checkFileExists(smallSvgPath);
  await checkFileExists(largeSvgPath);
  console.log("✅ Source files found");

  // Ensure app directory exists
  if (!fs.existsSync(publicDir)) {
    console.log("📁 Creating public directory...");
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate PNG files for each size using appropriate SVG
  const generatePngBuffer = (svgPath: string, size: number) =>
    sharp(svgPath)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

  // Generate OpenGraph preview image
  const generateOpenGraphBuffer = (svgPath: string) =>
    sharp(svgPath)
      .resize(1200, 630, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();

  // Generate all sizes
  console.log("🖼️ Generating PNG icons...");
  const pngBuffers = await Promise.all([
    ...smallSizes.map((size) => generatePngBuffer(smallSvgPath, size)),
    ...largeSizes.map((size) => generatePngBuffer(largeSvgPath, size)),
  ]);
  console.log(`✅ Generated ${pngBuffers.length} PNG icons`);

  // Generate OpenGraph image
  console.log("🖼️ Generating OpenGraph image...");
  const openGraphBuffer = await generateOpenGraphBuffer(largeSvgPath);

  // Create ICO file with all sizes
  const icoPath = path.join(publicDir, "favicon.ico");
  const openGraphPath = path.join(publicDir, "opengraph-image.png");

  // Convert PNG buffers to ICO
  console.log("🔄 Converting to ICO format...");
  const icoBuffer = await pngToIco(pngBuffers);

  // Write the ICO file
  console.log("💾 Saving files...");
  await fs.promises.writeFile(icoPath, icoBuffer);
  await fs.promises.writeFile(openGraphPath, openGraphBuffer);

  console.log("✨ Icon generation complete!");
  console.log("📁 Files generated:");
  console.log(`   - ${icoPath}`);
  console.log(`   - ${openGraphPath}`);
}

generateIcons().catch((error: Error) => {
  console.error("❌ Error generating icons:", error.message);
  process.exit(1);
});
