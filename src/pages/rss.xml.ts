import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";

type Item = {
  data: {
    title: string;
    description: string;
    date: string; // Assuming date is a string
  };
  collection: string;
  slug: string;
};

type Context = {
  site: string;
};

export async function GET(context: Context): Promise<string> {
  // Fetch the 'work' collection and filter out drafts
  const work: Item[] = (await getCollection("work")).filter(
    (item: Item) => !item.data.draft
  );

  // Since we are now only pulling from 'work', no need to merge arrays
  const items = work.sort(
    (a: Item, b: Item) =>
      new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items: items.map((item: Item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
