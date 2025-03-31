import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [mdx(), sitemap(), tailwind()],
  output: "hybrid",
  adapter: netlify({
    cacheOnDemandPages: true,
    compressHTML: true,
    build: {
      compress: true,
      headers: {
        "/*": {
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
        "/assets/*": {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        "/*.{js,css,svg,woff,woff2}": {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    },
  })
});
