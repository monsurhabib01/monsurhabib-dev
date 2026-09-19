// Regenerates the site's actual favicon/PWA icons from the vector brand
// source. Run: node gen_icons.js
// Source of truth: brand/logo.svg (standard) + brand/logo-maskable.svg
// (pre-built with proper ~80% safe-zone padding for Android adaptive icons).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const LOGO = path.join("brand", "logo.svg");
const LOGO_MASKABLE = path.join("brand", "logo-maskable.svg");
const OUT = path.join("public", "icons");

async function run() {
  fs.mkdirSync(OUT, { recursive: true });

  // Only the sizes actually referenced by manifest.json / layout.tsx metadata.
  for (const size of [192, 512]) {
    await sharp(LOGO, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(path.join(OUT, `icon-${size}x${size}.png`));
    console.log("wrote icon-" + size + "x" + size + ".png");
  }

  for (const size of [192, 512]) {
    await sharp(LOGO_MASKABLE, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(path.join(OUT, `icon-maskable-${size}x${size}.png`));
    console.log("wrote icon-maskable-" + size + "x" + size + ".png");
  }

  // apple-touch-icon: iOS ignores alpha transparency, so flatten onto the
  // brand background instead of the rounded-rect SVG background showing
  // through as black.
  await sharp(LOGO, { density: 384 })
    .resize(180, 180)
    .flatten({ background: "#0B1120" })
    .png()
    .toFile(path.join(OUT, "apple-touch-icon.png"));
  console.log("wrote apple-touch-icon.png");

  console.log("\nDone. favicon.ico (src/app/favicon.ico) is not regenerated");
  console.log("here — .ico needs multi-res encoding sharp can't do. Update it");
  console.log("via a favicon generator (e.g. favicon.io) from brand/logo.svg");
  console.log("if it ever needs to change.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
