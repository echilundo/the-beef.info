interface Tweet {
  id: string;
  text: string;
  author: string;
  authorUsername: string;
  date: string;
  hasVideo?: boolean;
  videoUrl?: string;
}

// In-memory cache for tweets during build
const tweetCache = new Map<string, Tweet>();

// Hardcoded tweet data since we can't access Twitter's API without authentication
const TWEET_DATA: Record<string, Tweet> = {
  "1003397584621309953": {
    id: "1003397584621309953",
    text: "Here's the audio from @DTLRradioFM along w. @FadamGotDaJuice @djreddz (6/2/18)",
    author: "DJ Flow",
    authorUsername: "ITSDJFLOW",
    date: "June 3, 2018",
    hasVideo: true
  },
  "1787275633736999106": {
    id: "1787275633736999106",
    text: "What did I just doooooo 😭😭😭 #bbldrizzybeatgiveaway",
    author: "Madison McFerrin",
    authorUsername: "madmcferrin",
    date: "May 6, 2024",
    hasVideo: true
  }
};

export async function getTweet(id: string): Promise<Tweet> {
  // Check cache first
  if (tweetCache.has(id)) {
    return tweetCache.get(id)!;
  }

  // Get from hardcoded data
  const tweet = TWEET_DATA[id];
  if (!tweet) {
    throw new Error(`Tweet with ID ${id} not found in cache`);
  }

  // Cache for subsequent requests
  tweetCache.set(id, tweet);
  return tweet;
}

export function clearTweetCache() {
  tweetCache.clear();
} 