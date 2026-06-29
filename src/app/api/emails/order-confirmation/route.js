// src/app/api/emails/order-confirmation/route.js

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.customerEmail || !orderData.orderId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: customerEmail and orderId are required",
        },
        { status: 400 }
      );
    }

    // Send customer confirmation email
    const customerEmailResult = await sendCustomerConfirmation(orderData);

    // Send admin notification (don't block on failure)
    try {
      await sendAdminNotification(orderData);
    } catch (adminError) {
    }

    return NextResponse.json({
      success: true,
      data: customerEmailResult,
      message: "Order confirmation sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process email request" },
      { status: 500 }
    );
  }
}

async function sendCustomerConfirmation(orderData) {
  const emailHtml = generateOrderConfirmationEmail(orderData);

  const { data, error } = await resend.emails.send({
    from: "Kavan The Brand <orders@kavanthebrand.com>",
    to: orderData.customerEmail,
    subject: `🎉 Order Confirmed - #${orderData.orderId}`,
    html: emailHtml,
    reply_to: "admin@kavanthebrand.com",
  });

  if (error) {
    throw new Error(`Customer email failed: ${error.message}`);
  }

  return data;
}

async function sendAdminNotification(orderData) {
  const adminHtml = generateAdminNotificationEmail(orderData);

  const { data, error } = await resend.emails.send({
    from: "Kavan The Brand <orders@kavanthebrand.com>",
    to: "admin@kavanthebrand.com",
    subject: `🛒 New Order #${orderData.orderId} - ₦${orderData.totalAmount?.toLocaleString() || "0"}`,
    html: adminHtml,
  });

  if (error) {
    throw new Error(`Admin notification failed: ${error.message}`);
  }

  return data;
}

// Helper function to format complete address
function formatCompleteAddress(orderData) {
  const parts = [];

  // Use shippingFullAddress if available (from Firestore)
  if (orderData.shippingFullAddress) {
    return orderData.shippingFullAddress;
  }

  // Otherwise construct from individual components
  if (orderData.shipping_address || orderData.shippingStreetAddress) {
    parts.push(orderData.shipping_address || orderData.shippingStreetAddress);
  }

  if (orderData.shipping_apartment || orderData.shippingApartment) {
    parts.push(
      `Apt/Suite: ${orderData.shipping_apartment || orderData.shippingApartment}`
    );
  }

  if (orderData.shipping_city || orderData.shippingCity) {
    parts.push(orderData.shipping_city || orderData.shippingCity);
  }

  if (orderData.shipping_state || orderData.shippingState) {
    parts.push(orderData.shipping_state || orderData.shippingState);
  }

  if (orderData.shipping_country || orderData.shippingCountry) {
    parts.push(orderData.shipping_country || orderData.shippingCountry);
  }

  if (orderData.shipping_postal_code || orderData.shippingPostalCode) {
    parts.push(
      `Postal Code: ${orderData.shipping_postal_code || orderData.shippingPostalCode}`
    );
  }

  return parts.length > 0 ? parts.join(", ") : "Address not specified";
}

function generateOrderConfirmationEmail(orderData) {
  const addressComponents = {
    country: orderData.shipping_country || orderData.shippingCountry,
    state: orderData.shipping_state || orderData.shippingState,
    city: orderData.shipping_city || orderData.shippingCity,
    street: orderData.shipping_address || orderData.shippingStreetAddress,
    apartment: orderData.shipping_apartment || orderData.shippingApartment,
    postalCode: orderData.shipping_postal_code || orderData.shippingPostalCode,
  };

  const orderDate = new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f2f2f2; font-family: Arial, sans-serif; }
    .wrap { max-width: 540px; margin: 28px auto; background: #ffffff; }
    .header { padding: 24px 32px 20px; border-bottom: 1px solid #ebebeb; }
    .body { padding: 28px 32px; }
    .greeting { font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #111; margin: 0 0 6px; }
    .subtext { font-size: 13px; color: #777; margin: 0 0 24px; line-height: 1.6; }
    .section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; display: block; margin-bottom: 14px; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 20px 0; }
    .kv-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 4px; }
    .kv-table td { padding: 6px 0; vertical-align: top; }
    .kv-table td:first-child { color: #aaa; width: 38%; }
    .kv-table td:last-child { color: #1a1a1a; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .items-table th { text-align: left; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; padding: 0 0 10px; font-weight: normal; border-bottom: 1px solid #ebebeb; }
    .items-table td { padding: 11px 0; border-bottom: 1px solid #f3f3f3; color: #333; vertical-align: top; }
    .items-table tr:last-child td { border-bottom: none; }
    .totals-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .totals-table td { padding: 5px 0; color: #666; }
    .totals-table td:last-child { text-align: right; }
    .total-final td { font-size: 14px; font-weight: bold; color: #111; border-top: 1px solid #ebebeb; padding-top: 12px; }
    .footer { padding: 20px 32px; border-top: 1px solid #ebebeb; font-size: 12px; color: #bbb; line-height: 1.7; text-align: center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <img src="https://www.kavanthebrand.com/logo.jpeg" alt="Kavan The Brand" height="40" style="display:block;" />
    </div>
    <div class="body">
      <h1 class="greeting">Order confirmed.</h1>
      <p class="subtext">Hi ${orderData.customerName || "there"}, thank you for your order. We're preparing it now and will reach out once it ships.</p>

      <span class="section-title">Order details</span>
      <table class="kv-table">
        <tr><td>Order ID</td><td>#${orderData.orderId}</td></tr>
        <tr><td>Date</td><td>${orderDate}</td></tr>
        <tr><td>Payment</td><td>${orderData.paymentMethod || "Card Payment"}</td></tr>
      </table>

      <hr class="divider">
      <span class="section-title">Items</span>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${(orderData.items || []).map((item) => `
          <tr>
            <td>
              <div style="font-weight:600;color:#111;margin-bottom:2px;">${item.name}</div>
              ${item.selectedSize && item.selectedSize !== "N/A" ? `<span style="color:#aaa;font-size:11px;">Size: ${item.selectedSize}</span>` : ""}
              ${item.color && item.color !== "N/A" ? `<span style="color:#aaa;font-size:11px;">${item.selectedSize && item.selectedSize !== "N/A" ? " &nbsp;·&nbsp; " : ""}Colour: ${item.color}</span>` : ""}
            </td>
            <td style="text-align:center;color:#888;">${item.quantity}</td>
            <td style="text-align:right;color:#333;">&#8358;${(item.price || 0).toLocaleString()}</td>
          </tr>`).join("")}
        </tbody>
      </table>

      <hr class="divider">
      <table class="totals-table">
        <tr><td>Subtotal</td><td>&#8358;${(orderData.subtotal || 0).toLocaleString()}</td></tr>
        <tr><td>Shipping</td><td>&#8358;${(orderData.shippingFee || 0).toLocaleString()}</td></tr>
        <tr class="total-final"><td>Total paid</td><td>&#8358;${(orderData.totalAmount || 0).toLocaleString()}</td></tr>
      </table>

      <hr class="divider">
      <span class="section-title">Delivering to</span>
      <p style="font-size:13px;color:#444;line-height:1.9;margin:0;">
        ${[
          orderData.customerName,
          addressComponents.street,
          addressComponents.apartment,
          addressComponents.city,
          addressComponents.state,
          addressComponents.country,
          addressComponents.postalCode,
        ].filter(Boolean).join("<br>")}
      </p>
    </div>
    <div class="footer">
      Thank you for choosing Kavan The Brand.<br>
      &copy; ${new Date().getFullYear()} Kavan The Brand. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

function generateAdminNotificationEmail(orderData) {
  const orderDate = new Date().toLocaleString("en-NG");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background: #f2f2f2; font-family: Arial, sans-serif; }
    .wrap { max-width: 540px; margin: 28px auto; background: #ffffff; }
    .header { background: #3A0303; padding: 20px 32px; }
    .header-title { color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: normal; margin: 0; }
    .header-sub { color: rgba(255,255,255,0.55); font-size: 12px; margin: 3px 0 0; }
    .body { padding: 28px 32px; }
    .section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; display: block; margin-bottom: 14px; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 20px 0; }
    .kv-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 4px; }
    .kv-table td { padding: 6px 0; vertical-align: top; }
    .kv-table td:first-child { color: #aaa; width: 38%; }
    .kv-table td:last-child { color: #1a1a1a; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .items-table th { text-align: left; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; padding: 0 0 10px; font-weight: normal; border-bottom: 1px solid #ebebeb; }
    .items-table td { padding: 11px 0; border-bottom: 1px solid #f3f3f3; color: #333; vertical-align: top; }
    .items-table tr:last-child td { border-bottom: none; }
    .totals-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .totals-table td { padding: 5px 0; color: #666; }
    .totals-table td:last-child { text-align: right; }
    .total-final td { font-size: 14px; font-weight: bold; color: #111; border-top: 1px solid #ebebeb; padding-top: 12px; }
    .btn { display: inline-block; background: #3A0303; color: #ffffff; text-decoration: none; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 24px; margin-top: 24px; }
    .footer { padding: 20px 32px; border-top: 1px solid #ebebeb; font-size: 12px; color: #bbb; text-align: center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <p class="header-title">New order received</p>
      <p class="header-sub">&#8358;${(orderData.totalAmount || 0).toLocaleString()} &mdash; ${orderDate}</p>
    </div>
    <div class="body">

      <span class="section-title">Customer</span>
      <table class="kv-table">
        <tr><td>Name</td><td>${orderData.customerName || "—"}</td></tr>
        <tr><td>Email</td><td>${orderData.customerEmail}</td></tr>
        <tr><td>Phone</td><td>${orderData.customerPhone || "—"}</td></tr>
      </table>

      <hr class="divider">
      <span class="section-title">Order</span>
      <table class="kv-table">
        <tr><td>Order ID</td><td>#${orderData.orderId}</td></tr>
        <tr><td>Reference</td><td>${orderData.paymentReference || "—"}</td></tr>
        <tr><td>Payment</td><td>${orderData.paymentMethod || "Card Payment"}</td></tr>
      </table>

      <hr class="divider">
      <span class="section-title">Items</span>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${(orderData.items || []).map((item) => `
          <tr>
            <td>
              <div style="font-weight:600;color:#111;margin-bottom:2px;">${item.name}</div>
              ${item.selectedSize && item.selectedSize !== "N/A" ? `<span style="color:#aaa;font-size:11px;">Size: ${item.selectedSize}</span>` : ""}
              ${item.color && item.color !== "N/A" ? `<span style="color:#aaa;font-size:11px;">${item.selectedSize && item.selectedSize !== "N/A" ? " &nbsp;·&nbsp; " : ""}Colour: ${item.color}</span>` : ""}
            </td>
            <td style="text-align:center;color:#888;">${item.quantity}</td>
            <td style="text-align:right;">&#8358;${(item.price || 0).toLocaleString()}</td>
          </tr>`).join("")}
        </tbody>
      </table>

      <hr class="divider">
      <table class="totals-table">
        <tr><td>Subtotal</td><td>&#8358;${(orderData.subtotal || 0).toLocaleString()}</td></tr>
        <tr><td>Shipping</td><td>&#8358;${(orderData.shippingFee || 0).toLocaleString()}</td></tr>
        <tr class="total-final"><td>Total</td><td>&#8358;${(orderData.totalAmount || 0).toLocaleString()}</td></tr>
      </table>

      <hr class="divider">
      <span class="section-title">Ship to</span>
      <p style="font-size:13px;color:#444;line-height:1.9;margin:0;">
        ${[
          orderData.customerName,
          orderData.shipping_address || orderData.shippingStreetAddress,
          orderData.shipping_apartment || orderData.shippingApartment,
          orderData.shipping_city || orderData.shippingCity,
          orderData.shipping_state || orderData.shippingState,
          orderData.shipping_country || orderData.shippingCountry,
        ].filter((v) => v && v !== "Not provided").join("<br>")}
      </p>

      <a href="https://www.kavanthebrand.com/admin/orders" class="btn">View in admin</a>
    </div>
    <div class="footer">
      Thank you for choosing Kavan The Brand.<br>
      &copy; ${new Date().getFullYear()} Kavan The Brand. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}
