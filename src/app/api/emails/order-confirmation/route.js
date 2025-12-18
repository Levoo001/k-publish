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
      console.error("Admin notification failed (non-critical):", adminError);
    }

    return NextResponse.json({
      success: true,
      data: customerEmailResult,
      message: "Order confirmation sent successfully",
    });
  } catch (error) {
    console.error("Email API route error:", error);
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
  // Get complete formatted address
  const completeAddress = formatCompleteAddress(orderData);

  // Get individual components for display
  const addressComponents = {
    country: orderData.shipping_country || orderData.shippingCountry,
    state: orderData.shipping_state || orderData.shippingState,
    city: orderData.shipping_city || orderData.shippingCity,
    street: orderData.shipping_address || orderData.shippingStreetAddress,
    apartment: orderData.shipping_apartment || orderData.shippingApartment,
    postalCode: orderData.shipping_postal_code || orderData.shippingPostalCode,
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Kavan The Brand</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #3A0303;
      background-color: #fdf2f2;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(58, 3, 3, 0.1);
    }
    
    .header {
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .order-info {
      background: #fdf2f2;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 25px;
      border-left: 4px solid #3A0303;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    
    .info-item h3 {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      margin-bottom: 10px;
      color: #3A0303;
    }
    
    .address-box {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
      border: 1px solid #e5e5e5;
    }
    
    .address-details {
      font-size: 14px;
      line-height: 1.5;
    }
    
    .address-details p {
      margin-bottom: 5px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .items-table th {
      background: #3A0303;
      color: white;
      padding: 15px 12px;
      text-align: left;
      font-weight: 500;
      font-size: 14px;
    }
    
    .items-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
    }
    
    .items-table tr:last-child td {
      border-bottom: none;
    }
    
    .total-section {
      background: #f8f8f8;
      padding: 25px;
      border-radius: 8px;
      margin-top: 25px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .total-row:last-child {
      border-bottom: none;
    }
    
    .final-total {
      font-size: 20px;
      font-weight: 600;
      color: #3A0303;
      border-top: 2px solid #3A0303;
      padding-top: 15px;
      margin-top: 15px;
    }
    
    .delivery-info {
      background: #e8f4fd;
      border: 1px solid #b8d9f0;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
    }
    
    .delivery-info h3 {
      font-family: 'Playfair Display', serif;
      color: #1e40af;
      margin-bottom: 12px;
    }
    
    .status-badge {
      display: inline-block;
      background: #10B981;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    
    .footer {
      background: #3A0303;
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .button {
      display: inline-block;
      background: #3A0303;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      margin: 10px 5px;
      border: 2px solid #3A0303;
    }
    
    .button-secondary {
      background: transparent;
      color: #3A0303;
      border: 2px solid #3A0303;
    }
    
    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .header, .content {
        padding: 25px 20px;
      }
      
      .button-container {
        flex-direction: column;
        gap: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for shopping with Kavan The Brand</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 15px; color: #3A0303;">Order #${orderData.orderId}</h2>
        <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${orderData.customerName}</strong>,</p>
        <p style="font-size: 16px;">Your order has been confirmed and is being processed. We'll notify you when it ships!</p>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <h3>📦 Shipping Details</h3>
          <div class="address-box">
            <div class="address-details">
              ${addressComponents.street ? `<p><strong>Street Address:</strong><br>${addressComponents.street}</p>` : ""}
              ${addressComponents.apartment ? `<p><strong>Apartment/Suite:</strong> ${addressComponents.apartment}</p>` : ""}
              ${addressComponents.city ? `<p><strong>City:</strong> ${addressComponents.city}</p>` : ""}
              ${addressComponents.state ? `<p><strong>State:</strong> ${addressComponents.state}</p>` : ""}
              ${addressComponents.country ? `<p><strong>Country:</strong> ${addressComponents.country}</p>` : ""}
              ${addressComponents.postalCode ? `<p><strong>Postal Code:</strong> ${addressComponents.postalCode}</p>` : ""}
            </div>
          </div>
          <p style="margin-top: 10px;"><strong>Phone:</strong> ${orderData.customerPhone || "Not specified"}</p>
          <p><strong>Shipping Provider:</strong> ${orderData.shippingProvider || "Standard Shipping"}</p>
          <p><strong>Shipping Type:</strong> ${orderData.shippingType === "international" ? "International" : "Domestic"}</p>
        </div>
        
        <div class="info-item">
          <h3>💳 Payment Details</h3>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod || "Card Payment"}</p>
          <p><strong>Reference ID:</strong> ${orderData.paymentReference || "N/A"}</p>
          <p><strong>Payment Status:</strong> Completed <span class="status-badge">✓ Paid</span></p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString(
            "en-NG",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}</p>
          <p><strong>Complete Address:</strong><br>
            <span style="font-size: 12px; color: #666;">${completeAddress}</span>
          </p>
        </div>
      </div>
      
      <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 20px; color: #3A0303; font-size: 22px;">Order Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${(orderData.items || [])
            .map(
              (item) => `
            <tr>
              <td style="font-weight: 500;">${item.name}</td>
              <td style="color: #666;">${item.selectedSize || "N/A"}</td>
              <td style="color: #666;">${item.color || "N/A"}</td>
              <td style="color: #666;">${item.quantity}</td>
              <td style="color: #666;">₦${(item.price || 0).toLocaleString()}</td>
              <td style="font-weight: 500;">₦${(item.total || 0).toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="total-section">
        <div class="total-row">
          <span style="font-weight: 500;">Subtotal:</span>
          <span style="font-weight: 500;">₦${(orderData.subtotal || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span style="font-weight: 500;">Shipping Fee:</span>
          <span style="font-weight: 500;">₦${(orderData.shippingFee || 0).toLocaleString()}</span>
        </div>
        <div class="total-row final-total">
          <span style="font-size: 20px; font-weight: 600;">Total Paid:</span>
          <span style="font-size: 20px; font-weight: 600;">₦${(orderData.totalAmount || 0).toLocaleString()}</span>
        </div>
      </div>
      
      <div class="delivery-info">
        <h3>🚚 Delivery Information</h3>
        <p><strong>Shipping Provider:</strong> ${orderData.shippingProvider || "Standard Shipping"}</p>
        <p><strong>Estimated Delivery Time:</strong> ${orderData.shippingType === "international" ? "5-10 business days" : "2-5 business days"}</p>
        <p><strong>Tracking:</strong> You will receive tracking information via SMS and email once your order ships.</p>
        <p style="margin-top: 15px; font-size: 14px; color: #1e40af;">
          <strong>Note:</strong> Please ensure the shipping address above is correct. Contact us immediately if you need to make any changes.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 35px;" class="button-container">
        <a href="https://www.kavanthebrand.com" class="button">Visit Our Store</a>
        <a href="mailto:admin@kavanthebrand.com" class="button button-secondary">Contact Support</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="font-size: 18px; margin-bottom: 20px;">Thank you for choosing Kavan The Brand</p>
      <div style="margin: 20px 0; padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="font-size: 14px; margin-bottom: 5px;"><strong>Store Contact:</strong> +234 703 621 0107</p>
        <p style="font-size: 14px; margin-bottom: 5px;"><strong>Email:</strong> admin@kavanthebrand.com</p>
        <p style="font-size: 14px;"><strong>Address:</strong> Lagos, Nigeria</p>
      </div>
      <p style="margin-top: 25px; font-size: 12px; opacity: 0.8;">
        &copy; 2025 Kavan The Brand. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminNotificationEmail(orderData) {
  // Get complete formatted address for admin
  const completeAddress = formatCompleteAddress(orderData);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    
    body { 
      font-family: 'Poppins', sans-serif; 
      color: #3A0303; 
      background: #fdf2f2; 
      padding: 20px; 
      margin: 0;
    }
    
    .container { 
      max-width: 700px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 10px 30px rgba(58, 3, 3, 0.1); 
    }
    
    .header { 
      background: #3A0303; 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    
    .content { 
      padding: 30px; 
    }
    
    .alert { 
      background: #FFFBEB; 
      border: 2px solid #F59E0B; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 0 0 30px 0; 
      text-align: center;
      font-weight: 500;
    }
    
    .section {
      margin-bottom: 30px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .section-header {
      background: #f8f8f8;
      padding: 15px 20px;
      border-bottom: 1px solid #e5e5e5;
      font-weight: 600;
      color: #3A0303;
    }
    
    .section-content {
      padding: 20px;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .info-item {
      margin-bottom: 10px;
    }
    
    .info-label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
      display: block;
      margin-bottom: 3px;
    }
    
    .info-value {
      font-weight: 400;
      color: #3A0303;
      font-size: 15px;
    }
    
    .address-box {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 6px;
      margin-top: 10px;
      border: 1px solid #e5e5e5;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0; 
    }
    
    .items-table th { 
      background: #3A0303; 
      color: white; 
      padding: 12px 15px; 
      text-align: left; 
      font-weight: 500; 
      font-size: 14px;
    }
    
    .items-table td { 
      padding: 12px 15px; 
      border-bottom: 1px solid #e5e5e5; 
      font-size: 14px;
    }
    
    .items-table tr:last-child td {
      border-bottom: none;
    }
    
    .total-section {
      background: #3A0303;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    
    .total-row:last-child {
      border-bottom: none;
      font-size: 18px;
      font-weight: 600;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid rgba(255,255,255,0.2);
    }
    
    .button { 
      display: inline-block; 
      background: #3A0303; 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 500;
      border: 2px solid #3A0303;
      transition: all 0.3s ease;
    }
    
    .button:hover {
      background: white;
      color: #3A0303;
    }
    
    @media (max-width: 700px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
      
      .content {
        padding: 20px;
      }
      
      .items-table {
        font-size: 12px;
      }
      
      .items-table th,
      .items-table td {
        padding: 8px 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 New Order Received!</h1>
      <p>Order #${orderData.orderId} - ₦${orderData.totalAmount?.toLocaleString() || "0"}</p>
    </div>
    
    <div class="content">
      <div class="alert">
        ⚡ <strong>Action Required:</strong> New order needs to be processed and shipped immediately.
      </div>
      
      <div class="section">
        <div class="section-header">👤 Customer Information</div>
        <div class="section-content grid-2">
          <div>
            <div class="info-item">
              <span class="info-label">Customer Name</span>
              <span class="info-value">${orderData.customerName || "Not provided"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value">${orderData.customerEmail}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-value">${orderData.customerPhone || "Not provided"}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Order ID</span>
              <span class="info-value">${orderData.orderId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Reference</span>
              <span class="info-value">${orderData.paymentReference || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Order Date</span>
              <span class="info-value">${new Date().toLocaleString("en-NG")}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">📦 Shipping Details</div>
        <div class="section-content grid-2">
          <div>
            <div class="info-item">
              <span class="info-label">Shipping Provider</span>
              <span class="info-value">${orderData.shippingProvider || "Standard Shipping"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Shipping Type</span>
              <span class="info-value">${orderData.shippingType === "international" ? "International" : "Domestic"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Shipping Fee</span>
              <span class="info-value">₦${(orderData.shippingFee || 0).toLocaleString()}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Payment Method</span>
              <span class="info-value">${orderData.paymentMethod || "Card Payment"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Status</span>
              <span class="info-value" style="color: #10B981; font-weight: 600;">✓ Completed</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">📍 Complete Shipping Address</div>
        <div class="section-content">
          <div class="address-box">
            ${completeAddress}
          </div>
          <div style="margin-top: 15px; font-size: 13px; color: #666;">
            <p><strong>Note for delivery:</strong> Please verify address details before shipping.</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">📋 Order Items (${orderData.itemCount || 0} items)</div>
        <div class="section-content">
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(orderData.items || [])
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.selectedSize || "N/A"}</td>
                  <td>${item.color || "N/A"}</td>
                  <td>${item.quantity}</td>
                  <td>₦${(item.price || 0).toLocaleString()}</td>
                  <td style="font-weight: 500;">₦${(item.total || 0).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₦${(orderData.subtotal || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>₦${(orderData.shippingFee || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span><strong>Total Amount:</strong></span>
          <span><strong>₦${(orderData.totalAmount || 0).toLocaleString()}</strong></span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 35px;">
        <a href="${process.env.NEXTAUTH_URL || "https://www.kavanthebrand.com"}/admin/orders" class="button">
          📋 View Order in Admin Panel
        </a>
        <p style="margin-top: 15px; font-size: 13px; color: #666;">
          Click the button above to process this order and update shipping status.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
