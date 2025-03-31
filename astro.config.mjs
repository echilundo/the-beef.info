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
      inlineStylesheets: "auto",
      minify: true,
      headers: {
        "/*": {
          "Cache-Control": "public, max-age=0, must-revalidate",
          "X-Content-Type-Options": "nosniff",
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
    inlineStylesheets: 'auto',
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
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@astrojs/client-router'],
      exclude: ['@astrojs/client-router/virtual'],
    },
    ssr: {
      noExternal: ['@astrojs/client-router']
    }
  }
});
