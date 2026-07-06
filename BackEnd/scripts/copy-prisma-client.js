// `tsc` only compiles .ts files, so it never copies Prisma's generated
// runtime (.js / .node / package.json files) from src/generated/prisma
// into dist/. Without this, the compiled app crashes at startup with
// "Cannot find module '.../generated/prisma'". This script copies the
// already-generated client into dist/ after the TypeScript build.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "src", "generated", "prisma");
const dest = path.join(__dirname, "..", "dist", "generated", "prisma");

if (!fs.existsSync(src)) {
  console.warn(`[copy-prisma-client] Nothing to copy, "${src}" does not exist.`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`[copy-prisma-client] Copied Prisma client to ${dest}`);
