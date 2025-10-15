import "server-only";
import { defineLive } from "next-sanity";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  fetch: {
    perspective: "published",
    cache: "no-store",
  },
  logger: console,
});
