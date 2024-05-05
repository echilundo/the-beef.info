import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";

type Context = {
  site: string
};

type WorkItem = {
  data: {
    draft?: boolean;
    date: Date | string;  // Assuming date can be either Date object or string
    title: string;
    description: string;
    slug: string;
    collection: string;  // Typically, this would be 'work'
  }
};

type RSSFeedItem = {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
};

export async function GET(context: Context) {
  const workItems = await getCollection<WorkItem>("work");

  const items: RSSFeedItem[] = workItems
    .filter(item => !item.data.draft)  // Filter out drafts
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())  // Sort by date
    .map((item) => ({  // Map to RSS feed item format
      title: item.data.title,
      description: item.data.description,
      pubDate: new Date(item.data.date),  // Ensure date is a Date object
      link: `/${item.collection}/${item.slug}/`,
    }));

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items,
  });
}
