const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Build configuration for browser bundle
async function build() {
  try {
    console.log('🌐 Building browser bundle...');

    // Build minified bundle
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      minify: true,
      sourcemap: true,
      format: 'iife',
      globalName: 'PDFStudio',
      outfile: 'dist/pdfstudio.standalone.js',
      platform: 'browser',
      target: ['es2020'],
      define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'window',
      },
      inject: ['./scripts/buffer-polyfill.js'],
      external: ['sharp'], // Exclude Node.js-only modules
      alias: {
        // Alias Node.js modules that don't exist in browser
        'crypto': './scripts/crypto-browser.js',
        'fs': './scripts/empty-module.js',
        'sharp': './scripts/empty-module.js',
      },
      banner: {
        js: `/*! @pdfstudio/pdfstudio v${require('../package.json').version} | MIT License | https://github.com/pdfstudio-dev/pdfstudio */`,
      },
      logLevel: 'info',
    });

    // Build unminified bundle for debugging
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      minify: false,
      sourcemap: true,
      format: 'iife',
      globalName: 'PDFStudio',
      outfile: 'dist/pdfstudio.standalone.debug.js',
      platform: 'browser',
      target: ['es2020'],
      define: {
        'process.env.NODE_ENV': '"development"',
        'global': 'window',
      },
      inject: ['./scripts/buffer-polyfill.js'],
      external: ['sharp'],
      alias: {
        'crypto': './scripts/crypto-browser.js',
        'fs': './scripts/empty-module.js',
        'sharp': './scripts/empty-module.js',
      },
      banner: {
        js: `/*! @pdfstudio/pdfstudio v${require('../package.json').version} (Debug) | MIT License | https://github.com/pdfstudio-dev/pdfstudio */`,
      },
      logLevel: 'info',
    });

    console.log('✅ Browser bundle created successfully!');
    console.log('   - dist/pdfstudio.standalone.js (minified)');
    console.log('   - dist/pdfstudio.standalone.debug.js (debug)');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
