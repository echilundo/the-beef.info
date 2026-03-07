/**
 * Shared timeline data for index and timeline-chunk (Load more).
 */
import { getCollection } from "astro:content";

export type WorkEntry = Awaited<ReturnType<typeof getWork>>[number];

const INITIAL_COUNT = 15;
const CHUNK_SIZE = 15;

export const TIMELINE = {
  INITIAL_COUNT,
  CHUNK_SIZE,
} as const;

export async function getWork() {
  const collection = (await getCollection("work")).sort(
    (a, b) => new Date(a.data.dateStart).valueOf() - new Date(b.data.dateStart).valueOf()
  );
  return Promise.all(
    collection.map(async (item) => {
      const { Content } = await item.render();
      return { ...item, Content };
    })
  );
}

export function getChunkCount(total: number): number {
  const remaining = Math.max(0, total - INITIAL_COUNT);
  return Math.ceil(remaining / CHUNK_SIZE);
}
