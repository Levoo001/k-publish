import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import BlouseClient from "./BlouseClient";

export default async function BlousePage() {
  const products = await client.fetch(
    productQuery,
    {},
    { next: { revalidate: 60 } },
  );

  return <BlouseClient products={products} />;
}
