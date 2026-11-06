import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const promo = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "shippingPromotion" && isActive == true && dateTime(endsAt) > dateTime(now())]
        | order(endsAt desc)[0]{ endsAt }`,
    );
    return NextResponse.json({ freeLocalShippingUntil: promo?.endsAt || null });
  } catch {
    return NextResponse.json({ freeLocalShippingUntil: null });
  }
}
