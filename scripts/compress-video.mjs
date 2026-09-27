// scripts/compress-video.mjs
// Compresses public/hero-video.mp4 for web using ffmpeg via @ffmpeg-installer.
// Usage: node scripts/compress-video.mjs

import { createRequire } from "module";
import { execFileSync } from "child_process";
import { existsSync, statSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const root = resolve(__dirname, "..");
const src = resolve(root, "public/hero-video.mp4");
const dest = resolve(root, "public/hero-video-compressed.mp4");
const poster = resolve(root, "public/hero-poster.jpg");

console.log("ffmpeg binary:", ffmpegPath);
console.log("Input :", src);
console.log("Output:", dest);
console.log("Poster:", poster);

const beforeBytes = statSync(src).size;
console.log(`\nOriginal size : ${(beforeBytes / 1024 / 1024).toFixed(2)} MB`);

// ── Step 1: Compress MP4 ──────────────────────────────────────────────────────
// -crf 28       : visually near-lossless at good compression (23=lossless, 51=worst)
// -preset slow  : better compression at expense of encoding time
// -movflags +faststart : moov atom at front → web streaming starts immediately
// -vf scale=... : keep original resolution (no scaling)
// -an           : strip audio (hero video is muted; sheds extra bytes)
console.log("\nCompressing MP4…");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", src,
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "slow",
    "-profile:v", "main",
    "-level", "4.0",
    "-movflags", "+faststart",
    "-an",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    dest,
  ],
  { stdio: "inherit" }
);

const afterBytes = statSync(dest).size;
console.log(`\nCompressed size : ${(afterBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Reduction       : ${(((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1)}%`);

// ── Step 2: Extract poster frame at 0.5 s ────────────────────────────────────
console.log("\nExtracting poster…");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-ss", "0.5",
    "-i", src,
    "-vframes", "1",
    "-q:v", "4",
    poster,
  ],
  { stdio: "inherit" }
);

const posterBytes = statSync(poster).size;
console.log(`Poster size     : ${(posterBytes / 1024).toFixed(1)} KB`);

// ── Step 3: Replace original only if compressed is smaller ───────────────────
if (afterBytes < beforeBytes) {
  copyFileSync(dest, src);
  console.log("\n✅  Replaced public/hero-video.mp4 with compressed version.");
} else {
  console.log("\n⚠️  Compressed file is not smaller — keeping original.");
}

console.log("\nDone.");
