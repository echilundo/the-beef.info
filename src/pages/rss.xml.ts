import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";

type Context = {
  site: string
}

export async function GET(context: Context) {
  const work = (await getCollection("work"))
    .filter(item => !item.data.draft);

  const items: RSSFeedItem[] = work
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
    .map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    }));

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items,
  });
}
