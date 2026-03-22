// src/app/shop/page.js

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const products = await client.fetch(
    productQuery,
    {},
    { next: { revalidate: 60 } },
  );

  return <ShopClient products={products} />;
}
