// This is a plain JS file (no TypeScript) so Vercel doesn't run esbuild on it.
// Vercel runs `npm run build` first (via project settings), which compiles
// the NestJS source to dist/. Then this file requires the compiled output.
module.exports = require('../dist/vercel');
