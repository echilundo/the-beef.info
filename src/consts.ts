import type { Site, Metadata } from "@types";

export const SITE: Site = {
  NAME: "The Beef",
  EMAIL: "", // Add the missing EMAIL property
  NUM_POSTS_ON_HOMEPAGE: 5, // Add the missing properties
  NUM_WORKS_ON_HOMEPAGE: 5, // Add the missing properties
  NUM_PROJECTS_ON_HOMEPAGE: 5, // Add the missing properties
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "The Beef tracks the greatest beef saga in hip-hop history.",
};

export const WORK: Metadata = {
  TITLE: "Timeline",
  DESCRIPTION: "A timeline of the events.",
};