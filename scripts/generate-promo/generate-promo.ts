//use the old syntax here for the standalone file
export {}; // makes this a module so its top-level names don't clash with other scripts
const sharp = require("sharp");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

/** Screenshots each promo page (src/app/promo/<slug>/page.tsx) in headless Chrome and saves it
 * as public/thumbnails/<slug>.png. Reuses a dev server already running at PROMO_BASE_URL, else
 * starts one. */

const ROOT = path.join(__dirname, "../..");
const PROMO_PAGES_DIR = path.join(ROOT, "src", "app", "promo");
const {
  THUMBNAIL_FOLDER,
  THUMBNAIL_WIDTH: OUT_WIDTH,
  THUMBNAIL_HEIGHT: OUT_HEIGHT,
} = require("../../src/lib/thumbnail");
const OUTPUT_DIR = path.join(ROOT, "public", THUMBNAIL_FOLDER);
const RENDER_SCALE = 2;
const DEFAULT_BASE_URL = "http://localhost:3000";
const OWN_SERVER_PORT = 3100;
const SERVER_TIMEOUT_MS = 180_000;

const CHROME_CANDIDATES: string[] = [
  process.env.CHROME_PATH ?? "",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findChrome(): string {
  const found = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error("Chrome/Edge not found. Set CHROME_PATH to its executable.");
  return found;
}

/** Every promo page: each folder in src/app/promo that has a page.tsx is one image, named after
 * the folder. */
function findSlugs(): string[] {
  return fs
    .readdirSync(PROMO_PAGES_DIR, { withFileTypes: true })
    .filter((entry: any) => entry.isDirectory())
    .map((entry: any) => entry.name)
    .filter((name: string) => fs.existsSync(path.join(PROMO_PAGES_DIR, name, "page.tsx")))
    .sort();
}

async function isUp(url: string): Promise<boolean> {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
}

async function waitUntilUp(url: string): Promise<void> {
  const deadline = Date.now() + SERVER_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isUp(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function stopServer(server: { pid: number; kill: () => void }): void {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
  } else {
    server.kill();
  }
}

async function renderSlug(chrome: string, baseUrl: string, slug: string): Promise<string> {
  const url = `${baseUrl}/promo/${slug}?capture`;
  await waitUntilUp(url);

  const tmpPath = path.join(os.tmpdir(), `promo-${slug}-${Date.now()}.png`);
  const result = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--force-device-scale-factor=${RENDER_SCALE}`,
    // Bigger than the stage: a headless window's viewport is smaller than the window itself.
    `--window-size=${OUT_WIDTH + 200},${OUT_HEIGHT + 300}`,
    "--virtual-time-budget=8000",
    `--screenshot=${tmpPath}`,
    url,
  ]);
  if (!fs.existsSync(tmpPath)) {
    throw new Error(`Chrome produced no screenshot for ${url}: ${result.stderr?.toString()}`);
  }

  // The ?capture flag pins the stage to the page's top-left corner, so crop exactly that.
  const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
  await sharp(tmpPath)
    .extract({ left: 0, top: 0, width: OUT_WIDTH * RENDER_SCALE, height: OUT_HEIGHT * RENDER_SCALE })
    .resize(OUT_WIDTH, OUT_HEIGHT)
    .png()
    .toFile(outPath);
  fs.unlinkSync(tmpPath);
  return outPath;
}

async function generatePromo(): Promise<void> {
  console.log("📣 Starting promo image generation...");
  const chrome = findChrome();

  let baseUrl = process.env.PROMO_BASE_URL ?? DEFAULT_BASE_URL;
  let server: { pid: number; kill: () => void } | null = null;
  if (await isUp(baseUrl)) {
    console.log(`🌐 Using the server already running at ${baseUrl}`);
  } else {
    baseUrl = `http://localhost:${OWN_SERVER_PORT}`;
    console.log(`🚀 Starting a dev server on ${baseUrl}...`);
    server = spawn(
      process.execPath,
      [path.join(ROOT, "node_modules/next/dist/bin/next"), "dev", "-p", String(OWN_SERVER_PORT)],
      { cwd: ROOT, stdio: "ignore" },
    );
  }

  try {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const slug of findSlugs()) {
      console.log(`🖼️ Rendering ${slug}...`);
      console.log(`✅ Saved ${await renderSlug(chrome, baseUrl, slug)}`);
    }
  } finally {
    if (server) stopServer(server);
  }
  console.log("✨ Promo image generation complete!");
}

generatePromo().catch((error: Error) => {
  console.error("❌ Error generating promo image:", error.message);
  process.exit(1);
});
