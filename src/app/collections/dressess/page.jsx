// src/app/collections/dressess/page.jsx

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import DressessClient from "./DressessClient";

export default async function DressessPage() {
    const products = await client.fetch(productQuery);

    return <DressessClient products={products} />;
}