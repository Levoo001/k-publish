import crypto from "crypto";
import { saveOrder } from "@/lib/firestoreService";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return new Response("OK", { status: 200 });
  }

  const data = event.data;
  const customFields = data.metadata?.custom_fields || [];
  const getField = (name) =>
    customFields.find((f) => f.variable_name === name)?.value;

  let paymentMethod = "Card Payment";
  if (data.channel === "bank") paymentMethod = "Bank Transfer";
  else if (data.channel === "ussd") paymentMethod = "USSD";
  else if (data.channel === "mobile_money") paymentMethod = "Mobile Money";
  else if (data.channel === "qr") paymentMethod = "QR Code";

  const orderData = {
    customerEmail: data.customer?.email || getField("customer_email"),
    customerName: getField("customer_name"),
    customerPhone: getField("customer_phone"),

    shipping_country: getField("shipping_country"),
    shipping_state: getField("shipping_state"),
    shipping_city: getField("shipping_city"),
    shipping_address: getField("shipping_address"),
    shipping_apartment: getField("shipping_apartment"),
    shipping_postal_code: getField("shipping_postal_code"),
    shippingProvider: getField("shipping_provider"),
    shipping_type: getField("shipping_type"),
    shippingFee: Number(getField("shipping_fee")) || 0,

    items: data.metadata?.items || [],
    itemCount: Number(data.metadata?.item_count) || 0,
    subtotal: Number(data.metadata?.subtotal) || 0,
    totalAmount: Number(data.metadata?.total) || data.amount / 100,

    paymentMethod,
    paymentReference: data.reference,
    paymentChannel: data.channel,
    paymentStatus: "completed",
    orderStatus: "confirmed",

    storeContact: "+234 703 621 0107",
    storeEmail: "admin@kavanthebrand.com",
    storeAddress: "Lagos, Nigeria",

    notes: `Payment via ${data.channel}. Server-verified by Paystack webhook.`,
  };

  try {
    const orderId = await saveOrder(orderData);

    // Send order confirmation email
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        `https://${request.headers.get("host")}`;
      await fetch(`${baseUrl}/api/emails/order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderData, orderId }),
      });
    } catch (emailError) {
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
