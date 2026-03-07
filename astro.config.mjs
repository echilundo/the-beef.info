import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://the-beef.info",
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
    compressHTML: true,
    build: {
      headers: {
        "/*": {
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=60",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
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
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('astro')) {
                return 'astro';
              }
              if (id.includes('plyr')) {
                return 'plyr';
              }
              return 'vendor';
            }
          },
          compact: true,
          minifyInternalExports: true,
        }
      },
      chunkSizeWarningLimit: 1000,
      target: 'esnext',
      modulePreload: {
        polyfill: false
      }
    },
    optimizeDeps: {
      include: [],
    },
  }
});
