// src/app/page.js

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import PageClient from "../components/PageClient";

export default async function Page() {
  const products = await client.fetch(productQuery);

  return <PageClient products={products} />;
}
