import { client } from "@/sanity/lib/client";
import { productQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { matchesCategory } from "@/lib/productCategory";
import CollectionClient from "./CollectionClient";

export const revalidate = 60;

const CATEGORY_META = {
  bestsellers: {
    title: "Bestsellers",
    description: "Our most-loved pieces — the styles our customers keep coming back for.",
  },
  dresses: {
    title: "Dresses",
    description: "Elegant dresses crafted for every occasion.",
  },
  dressess: {
    title: "Dresses",
    description: "Elegant dresses crafted for every occasion.",
  },
  blouse: {
    title: "Blouse",
    description: "Refined blouses designed with intention.",
  },
  "co-ords": {
    title: "Co-ords",
    description: "Perfectly matched sets for an effortless look.",
  },
  pants: {
    title: "Pants",
    description: "Tailored trousers for effortless movement.",
  },
  jumpsuits: {
    title: "Jumpsuits",
    description: "One-piece style, zero compromise.",
  },
};

const BESTSELLER_NAMES = [
  "The Chisom Dress",
  "The Amarachi Set",
  "Urenna Mini-skirt Set",
  "Urenna Midi-Set",
  "Urenna Pant-Set",
  "Grace Midi-skirt Set",
];

const PANTS_NAMES = ["Udo Pants", "Urenna Pant-Set", "The Amara Set"];

const JUMPSUIT_NAMES = ["Salama Jumpsuit"];

function filterByCategory(products, category) {
  return products.filter((p) => {
    const tags = p.categories || [];

    // Curated lists — these deliberately include products that carry no
    // category tag yet, so a tag OR a listed name qualifies.
    switch (category) {
      case "bestsellers":
        return tags.includes("bestsellers") || BESTSELLER_NAMES.includes(p.name);
      case "pants":
        return tags.includes("pants") || PANTS_NAMES.includes(p.name);
      case "jumpsuits":
        return tags.includes("jumpsuits") || JUMPSUIT_NAMES.includes(p.name);
      default:
        break;
    }

    // Everything else: an explicit tag decides, and only untagged products
    // fall back to the legacy name heuristic. (Shared with the static
    // collection pages so the two can't drift apart again.)
    return matchesCategory(p, category);
  });
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return { title: "Collection Not Found" };
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Kavan The Brand`,
      description: meta.description,
      url: `https://www.kavanthebrand.com/collections/${category}`,
      images: [{ url: "/logo.jpeg", width: 800, height: 600, alt: "Kavan The Brand" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Kavan The Brand`,
      description: meta.description,
      images: ["/logo.jpeg"],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }));
}

export default async function CollectionPage({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) notFound();

  const allProducts = await client.fetch(productQuery, {}, { next: { revalidate: 3600 } });
  const products = filterByCategory(allProducts, category);

  return (
    <CollectionClient
      products={products}
      title={meta.title}
      description={meta.description}
      category={category}
    />
  );
}
