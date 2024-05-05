import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";

type Context = {
  site: string
};

export async function GET(context: Context) {
  const workItems = await getCollection("work");

  const items = workItems
    .filter(item => !(item.data as any).draft)  // Temporarily casting to 'any' to bypass type checking; fix with proper type if 'draft' exists
    .sort((a, b) => new Date((a.data as any).dateStart).valueOf() - new Date((b.data as any).dateStart).valueOf())
    .map(item => ({
      title: `${item.data.role} at ${item.data.company}`,
      description: `Role: ${item.data.role}, Company: ${item.data.company}`,
      pubDate: new Date(item.data.dateStart),
      link: `/${item.collection}/${item.slug}/`,
    }));

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items,
  });
}
