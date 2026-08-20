import { client } from "@/sanity/lib/client";
import { allProductSlugsQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://www.kavanthebrand.com";

const STATIC_ROUTES = [
  { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
  { url: `${BASE_URL}/shop`, priority: 0.9, changeFrequency: "daily" },
  { url: `${BASE_URL}/collections/bestsellers`, priority: 0.8, changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/dresses`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/blouse`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/co-ords`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/pants`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/jumpsuits`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE_URL}/about-us`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE_URL}/contact-us`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE_URL}/delivery-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${BASE_URL}/refund-and-exchange-policy`, priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap() {
  let productRoutes = [];

  try {
    const products = await client.fetch(allProductSlugsQuery);
    productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        priority: 0.8,
        changeFrequency: "weekly",
      }));
  } catch {
    // Fail gracefully — sitemap still returns static routes
  }

  return [...STATIC_ROUTES, ...productRoutes];
}
