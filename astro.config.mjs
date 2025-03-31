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
  })
});
