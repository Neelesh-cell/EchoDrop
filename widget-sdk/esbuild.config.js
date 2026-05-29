const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  outfile: path.join(__dirname, '../public/widget.js'),
}).catch(() => process.exit(1));
