import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [mdx(), sitemap(), tailwind()],
  output: "static",
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    remotePatterns: [{
      protocol: "https",
      hostname: "res.cloudinary.com"
    }],
  },
  adapter: netlify({
    cacheOnDemandPages: true,
    compressHTML: true,
    build: {
      compress: true,
      inlineStylesheets: "always",
      minify: true,
      headers: {
        "/*": {
          "Cache-Control": "public, max-age=0, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        },
        "/assets/*": {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        "/*.{js,css,svg,woff,woff2}": {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        "/images/*": {
          "Cache-Control": "public, max-age=31536000, immutable",
        }
      },
    },
  }),
  build: {
    inlineStylesheets: 'always',
    assets: 'assets',
    splitting: true,
    prebuild: true,
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
          passes: 3,
          unsafe_math: true,
        },
        mangle: {
          toplevel: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'critical': [
              './src/components/Head.astro',
              './src/layouts/Layout.astro'
            ],
            'router': ['@astrojs/client-router'],
          },
          compact: true,
          minifyInternalExports: true,
        }
      }
    },
    optimizeDeps: {
      include: ['@astrojs/client-router'],
      exclude: ['@astrojs/client-router/virtual'],
      force: true,
    },
    ssr: {
      noExternal: ['@astrojs/client-router']
    }
  }
});
