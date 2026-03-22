// src/app/collections/bestsellers/page.jsx

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import BestsellersClient from "./BestsellersClient";

export default async function BestsellersPage() {
  const products = await client.fetch(
    productQuery,
    {},
    { next: { revalidate: 60 } },
  );

  return <BestsellersClient products={products} />;
}
