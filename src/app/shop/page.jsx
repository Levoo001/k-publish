// src/app/shop/page.js

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import ShopClient from "@/components/ShopClient";

export default async function ShopPage() {
  const products = await client.fetch(productQuery);

  return <ShopClient products={products} />;
}
