import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    const result = await validateCoupon(code, Number(subtotal) || 0);

    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { valid: false, message: "Could not validate coupon. Please try again." },
      { status: 500 },
    );
  }
}
