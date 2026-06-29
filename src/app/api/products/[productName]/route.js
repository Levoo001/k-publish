import { client } from "@/sanity/lib/client";
import { productByNameQuery } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { productName } = await params;
  const decodedName = decodeURIComponent(productName);

  try {
    const product = await client.fetch(productByNameQuery, {
      name: decodedName,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
