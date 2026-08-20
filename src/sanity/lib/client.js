// src/sanity/lib/client.js
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// In local dev, show drafts too (so unpublished/unfinished products render on
// localhost) when a read token is present. Production always stays locked to
// published-only, regardless of the token, so drafts can never leak live.
const isDev = process.env.NODE_ENV !== "production";
const readToken = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDev,
  perspective: isDev && readToken ? "drafts" : "published",
  token: isDev ? readToken : undefined,
});
