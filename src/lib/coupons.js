import { client } from "@/sanity/lib/client";

const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

/**
 * Looks up a coupon by code and checks it against the given subtotal.
 * Always re-reads from Sanity (bypassing the CDN cache), so this is safe to
 * trust even though the caller is a client-controlled API request.
 */
export async function validateCoupon(rawCode, subtotal) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return { valid: false, message: "Enter a coupon code" };

  const coupon = await client.withConfig({ useCdn: false }).fetch(
    `*[_type == "coupon" && upper(code) == $code][0]{
      _id, code, isActive, discountType, discountValue,
      minOrderAmount, expiresAt
    }`,
    { code },
  );

  if (!coupon || !coupon.isActive) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `This code requires a minimum order of ${fmtNaira(coupon.minOrderAmount)}`,
    };
  }

  const rawDiscount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);

  return {
    valid: true,
    code: coupon.code.toUpperCase(),
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
  };
}
