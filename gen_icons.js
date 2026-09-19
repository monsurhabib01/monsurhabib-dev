const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join("public", "favicon_io", "android-chrome-512x512.png");
const OUT = path.join("public", "icons");
const BG = "#0f172a"; // matches manifest theme_color/background_color

const regularSizes = [16, 32, 48, 72, 96, 120, 144, 152, 167, 180, 192, 256, 384, 512];

async function run() {
  for (const size of regularSizes) {
    await sharp(SRC)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT, `icon-${size}x${size}.png`));
    console.log("wrote icon-" + size + "x" + size + ".png");
  }

  // apple-touch-icon (180x180, no transparency — Apple ignores alpha, so flatten to bg)
  await sharp(SRC)
    .resize(180, 180)
    .flatten({ background: BG })
    .png()
    .toFile(path.join(OUT, "apple-touch-icon.png"));
  console.log("wrote apple-touch-icon.png");

  // maskable icons: logo at ~70% scale centered on a full-bleed bg square (safe zone)
  for (const size of [192, 512]) {
    const inner = Math.round(size * 0.7);
    const logo = await sharp(SRC).resize(inner, inner).toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG,
      },
    })
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toFile(path.join(OUT, `icon-maskable-${size}x${size}.png`));
    console.log("wrote icon-maskable-" + size + "x" + size + ".png");
  }

  // Copy the real multi-res favicon.ico into both serving locations
  fs.copyFileSync(
    path.join("public", "favicon_io", "favicon.ico"),
    path.join(OUT, "favicon.ico")
  );
  fs.copyFileSync(
    path.join("public", "favicon_io", "favicon.ico"),
    path.join("src", "app", "favicon.ico")
  );
  console.log("copied favicon.ico to public/icons and src/app");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
