//use the old syntax here for the standalone file
export {}; // makes this a module so its top-level names don't clash with other scripts
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const opentype = require("opentype.js");
const tsconfigPaths = require("tsconfig-paths");

/** Renders the promo figures with VexFlow (SVG, in jsdom) and saves each as public/<slug>.png.
 * No browser or running server needed. The figure definitions below are the source. */

const ROOT = path.join(__dirname, "../..");
const PUBLIC_DIR = path.join(ROOT, "public");

// Lets the app's "@/..." imports resolve when running outside Next.
tsconfigPaths.register({ baseUrl: ROOT, paths: { "@/*": ["src/*"] } });

const SCALE = 4;
const STAFF_WIDTH = 200;
const STAFF_HEIGHT = 90;
const CARD_PADDING = 16;
const CARD_RADIUS = 8;
const CARD_FILL = "#dcdcdc";
const CARD_STROKE = "#c4c4c4";
const MARGIN = 24;

const PX_PER_PT = 4 / 3;

/** VexFlow draws notation as <text> in the Bravura font, which the SVG rasterizer doesn't have.
 * Swap each one for the equivalent outline path. */
function textToPaths(holder: Element, font: any): void {
  for (const text of Array.from(holder.querySelectorAll("text"))) {
    const sizePt = parseFloat(text.getAttribute("font-size") ?? "10");
    const x = parseFloat(text.getAttribute("x") ?? "0");
    const y = parseFloat(text.getAttribute("y") ?? "0");
    const d = font.getPath(text.textContent ?? "", x, y, sizePt * PX_PER_PT).toPathData(3);
    const path = text.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "none");
    text.replaceWith(path);
  }
}

/** jsdom has no canvas, which VexFlow uses to measure glyph sizes while laying out the staff.
 * Answer those measurements from the Bravura font file instead. */
function installTextMeasurement(window: any, font: any): void {
  window.HTMLCanvasElement.prototype.getContext = () => ({
    font: "",
    measureText(this: { font: string }, text: string) {
      const match = /(\d+(?:\.\d+)?)\s*(pt|px)/.exec(this.font);
      const sizePx = match ? parseFloat(match[1]) * (match[2] === "pt" ? PX_PER_PT : 1) : 10 * PX_PER_PT;
      const box = font.getPath(text, 0, 0, sizePx).getBoundingBox();
      return {
        width: font.getAdvanceWidth(text, sizePx),
        actualBoundingBoxAscent: -box.y1,
        actualBoundingBoxDescent: box.y2,
        actualBoundingBoxLeft: -box.x1,
        actualBoundingBoxRight: box.x2,
      };
    },
  });
}

async function generatePromo(): Promise<void> {
  console.log("📣 Starting promo image generation...");

  // VexFlow needs a DOM; set the globals before loading anything that uses it.
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;

  const { Factory } = require("vexflow");
  const { drawStaticStaff } = require("@/utils/StaticStaffRenderer");
  const { C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1 } = require("@/lib/learn/staffFigures");

  const figures: { slug: string; chords: unknown; keySignature?: string }[] = [
    {
      slug: "whats-wrong-with-music-theory",
      chords: C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1.chords,
      keySignature: "E",
    },
  ];

  const fontBuffer: Buffer = fs.readFileSync(require.resolve("@vexflow-fonts/bravura/bravura.otf"));
  const font = opentype.parse(
    fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength),
  );
  installTextMeasurement(dom.window, font);
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  for (const { slug, chords, keySignature } of figures) {
    console.log(`🖼️ Rendering ${slug}...`);
    const holder = dom.window.document.createElement("div");
    holder.id = `staff-${slug}`;
    dom.window.document.body.appendChild(holder);
    const factory = new Factory({
      renderer: { elementId: holder.id, width: STAFF_WIDTH, height: STAFF_HEIGHT },
    });
    drawStaticStaff(factory, STAFF_WIDTH, chords, keySignature);

    textToPaths(holder, font);
    const innerSvg: string = holder.innerHTML;
    const cardWidth = STAFF_WIDTH + CARD_PADDING * 2;
    const cardHeight = STAFF_HEIGHT + CARD_PADDING * 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth + MARGIN * 2}" height="${cardHeight + MARGIN * 2}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect x="${MARGIN}" y="${MARGIN}" width="${cardWidth}" height="${cardHeight}" rx="${CARD_RADIUS}" fill="${CARD_FILL}" stroke="${CARD_STROKE}"/>
  <g transform="translate(${MARGIN + CARD_PADDING} ${MARGIN + CARD_PADDING})">${innerSvg}</g>
</svg>`;

    const outPath = path.join(PUBLIC_DIR, `${slug}.png`);
    await sharp(Buffer.from(svg), { density: 72 * SCALE })
      .png()
      .toFile(outPath);
    console.log(`✅ Saved ${outPath}`);
  }
  console.log("✨ Promo image generation complete!");
}

generatePromo().catch((error: Error) => {
  console.error("❌ Error generating promo image:", error.stack ?? error.message);
  process.exit(1);
});
