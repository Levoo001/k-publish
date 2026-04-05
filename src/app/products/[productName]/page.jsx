import { client } from "@/sanity/lib/client";
import { productByNameQuery } from "@/sanity/lib/queries";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }) {
  const { productName } = await params;
  const decodedProductName = decodeURIComponent(productName);

  const product = await client.fetch(productByNameQuery, {
    name: decodedProductName,
  });

  return <ProductPageClient product={product} />;
}
