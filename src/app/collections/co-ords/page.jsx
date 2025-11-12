// src/app/collections/co-ords/page.jsx

import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import CoOrdsClient from "./CoOrdsClient";

export default async function CoOrdsPage() {
    const products = await client.fetch(productQuery);

    return <CoOrdsClient products={products} />;
}