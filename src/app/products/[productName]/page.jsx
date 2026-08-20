import { client } from "@/sanity/lib/client";
import {
  productBySlugQuery,
  productByNameQuery,
  allProductSlugsQuery,
  productQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { getRelatedProducts } from "@/lib/relatedProducts";
import ProductPageClient from "./ProductPageClient";
import RelatedProducts from "@/components/RelatedProducts";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await client.fetch(allProductSlugsQuery);
  return products.filter((p) => p.slug).map((p) => ({ productName: p.slug }));
}

export async function generateMetadata({ params }) {
  const { productName } = await params;
  const decoded = decodeURIComponent(productName);

  const product =
    (await client.fetch(productBySlugQuery, { slug: decoded })) ||
    (await client.fetch(productByNameQuery, { name: decoded }));

  if (!product) {
    return { title: "Product Not Found" };
  }

  const rawDescription =
    typeof product.description === "string"
      ? product.description.replace(/[#*_`[\]]/g, "").trim()
      : "";
  const description = rawDescription
    ? rawDescription.length > 90
      ? rawDescription.slice(0, 90) + "…"
      : rawDescription
    : `Shop ${product.name} at Kavan The Brand.`;

  const ogImageUrl = product.image?.[0]
    ? urlFor(product.image[0]).width(1200).height(630).quality(90).url()
    : null;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Kavan The Brand`,
      description,
      url: `https://www.kavanthebrand.com/products/${product.slug?.current || encodeURIComponent(product.name)}`,
      type: "website",
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: product.name }]
        : [
            {
              url: "/logo.jpeg",
              width: 800,
              height: 600,
              alt: "Kavan The Brand",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Kavan The Brand`,
      description,
      images: ogImageUrl ? [ogImageUrl] : ["/logo.jpeg"],
    },
    alternates: {
      canonical: `https://www.kavanthebrand.com/products/${product.slug?.current || encodeURIComponent(product.name)}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { productName } = await params;
  const decoded = decodeURIComponent(productName);

  const product =
    (await client.fetch(productBySlugQuery, { slug: decoded })) ||
    (await client.fetch(productByNameQuery, { name: decoded }));

  if (!product) notFound();

  // Related products never block the page: if this fetch fails the product
  // itself still renders, just without the recommendations strip.
  let related = [];
  try {
    const allProducts = await client.fetch(
      productQuery,
      {},
      { next: { revalidate: 3600 } },
    );
    // The strip scrolls horizontally, so it can carry more than a grid row.
    related = getRelatedProducts(product, allProducts, 12);
  } catch {
    related = [];
  }

  return (
    <>
      <ProductPageClient product={product} />
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-10 sm:pb-14">
          <RelatedProducts products={related} />
        </div>
      )}
    </>
  );
}
