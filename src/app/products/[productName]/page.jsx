import { client } from "@/sanity/lib/client";
import {
  productBySlugQuery,
  productByNameQuery,
  allProductSlugsQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await client.fetch(allProductSlugsQuery);
  return products
    .filter((p) => p.slug)
    .map((p) => ({ productName: p.slug }));
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
  const description = rawDescription.slice(0, 160) || `Shop ${product.name} at Kavan The Brand.`;

  const ogImageUrl =
    product.image?.[0]
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
        : [{ url: "/logo.jpeg", width: 800, height: 600, alt: "Kavan The Brand" }],
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

  return <ProductPageClient product={product} />;
}
