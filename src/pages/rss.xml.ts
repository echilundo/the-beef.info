import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { HOME } from "@consts";
export const GET: APIRoute = async ({ site }) => {
  const workItems = await getCollection("work");
  const siteUrl = site ?? import.meta.env.SITE;

  if (!siteUrl) {
    throw new Error("RSS generation requires `site` or `SITE` to be configured.");
  }

  const items = workItems
    .sort((a, b) => new Date(a.data.dateStart).valueOf() - new Date(b.data.dateStart).valueOf())
    .map(item => ({
      title: `${item.data.role} at ${item.data.company}`,
      description: `${item.data.role} — ${item.data.company}`,
      pubDate: new Date(item.data.dateStart),
      link: `/${item.collection}/${item.id}/`,
    }));

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: siteUrl,
    items,
  });
};
