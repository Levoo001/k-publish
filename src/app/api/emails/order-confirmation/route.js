// src/app/api/emails/order-confirmation/route.js - ENHANCED & BEAUTIFUL

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.customerEmail || !orderData.orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerEmail and orderId are required' },
        { status: 400 }
      );
    }

    // Send customer confirmation email
    const customerEmailResult = await sendCustomerConfirmation(orderData);

    // Send admin notification (don't block on failure)
    try {
      await sendAdminNotification(orderData);
    } catch (adminError) {
      console.error('Admin notification failed (non-critical):', adminError);
    }

    return NextResponse.json({
      success: true,
      data: customerEmailResult,
      message: 'Order confirmation sent successfully'
    });

  } catch (error) {
    console.error('Email API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process email request' },
      { status: 500 }
    );
  }
}

async function sendCustomerConfirmation(orderData) {
  const emailHtml = generateOrderConfirmationEmail(orderData);

  const { data, error } = await resend.emails.send({
    from: 'Kavan The Brand <orders@kavanthebrand.com>',
    to: orderData.customerEmail,
    subject: `🎉 Order Confirmed - #${orderData.orderId}`,
    html: emailHtml,
    reply_to: 'admin@kavanthebrand.com',
  });

  if (error) {
    throw new Error(`Customer email failed: ${error.message}`);
  }

  return data;
}

async function sendAdminNotification(orderData) {
  const adminHtml = generateAdminNotificationEmail(orderData);

  const { data, error } = await resend.emails.send({
    from: 'Kavan The Brand <orders@kavanthebrand.com>',
    to: 'admin@kavanthebrand.com', // Replace with your admin email
    subject: `🛒 New Order #${orderData.orderId} - ₦${orderData.totalAmount?.toLocaleString() || '0'}`,
    html: adminHtml,
  });

  if (error) {
    throw new Error(`Admin notification failed: ${error.message}`);
  }

  return data;
}

function generateOrderConfirmationEmail(orderData) {
  // CONSTRUCT PROPER ADDRESS FOR EMAIL
  const shippingAddress = orderData.shippingAddress ||
    [orderData.shipping_address, orderData.shipping_state, orderData.shipping_country]
      .filter(Boolean)
      .join(', ') || 'Address not specified';

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
          <p><strong>Address:</strong><br>${shippingAddress}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone || 'Not specified'}</p>
          <p><strong>Provider:</strong> ${orderData.shippingProvider || 'Standard Shipping'}</p>
          <p><strong>Type:</strong> ${orderData.shippingType === 'international' ? 'International' : 'Domestic'}</p>
        </div>
        
        <div class="info-item">
          <h3>💳 Payment Details</h3>
          <p><strong>Method:</strong> ${orderData.paymentMethod || 'Card Payment'}</p>
          <p><strong>Reference:</strong> ${orderData.paymentReference || 'N/A'}</p>
          <p><strong>Status:</strong> Completed <span class="status-badge">✓ Paid</span></p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</p>
        </div>
      </div>
      
      <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 20px; color: #3A0303; font-size: 22px;">Order Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${(orderData.items || []).map(item => `
            <tr>
              <td style="font-weight: 500;">${item.name}</td>
              <td style="color: #666;">${item.color || 'N/A'}</td>
              <td style="color: #666;">${item.quantity}</td>
              <td style="font-weight: 500;">₦${(item.total || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
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
        <p><strong>Estimated Delivery:</strong> ${orderData.shippingType === 'international' ? '5-10 business days' : '2-5 business days'}</p>
        <p>You will receive tracking information via SMS and email once your order ships.</p>
      </div>
      
      <div style="text-align: center; margin-top: 35px;" class="button-container">
        <a href="https://kavanthebrand.com" class="button">Visit Our Store</a>
        <a href="mailto:admin@kavanthebrand.com" class="button button-secondary">Contact Support</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="font-size: 18px; margin-bottom: 20px;">Thank you for choosing kavanthebrand</p>
      <p style="margin-top: 25px; font-size: 12px; opacity: 0.8;">
        &copy; 2025 kavanthebrand. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminNotificationEmail(orderData) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Poppins', sans-serif; color: #3A0303; background: #fdf2f2; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(58, 3, 3, 0.1); }
    .header { background: #3A0303; color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .alert { background: #FFFBEB; border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
    .info-item { background: #f8f8f8; padding: 20px; border-radius: 8px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { background: #3A0303; color: white; padding: 12px; text-align: left; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e5; }
    .total { background: #3A0303; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
    .button { display: inline-block; background: #3A0303; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 10px 5px; }
    @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 New Order Received!</h1>
      <p>Order #${orderData.orderId}</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong>Action Required:</strong> New order needs to be processed and shipped.
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <h3>👤 Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        </div>
        
        <div class="info-item">
          <h3>📦 Shipping Details</h3>
          <p><strong>Address:</strong> ${orderData.shippingAddress}</p>
          <p><strong>Provider:</strong> ${orderData.shippingProvider}</p>
          <p><strong>Type:</strong> ${orderData.shippingType}</p>
          <p><strong>Fee:</strong> ₦${(orderData.shippingFee || 0).toLocaleString()}</p>
        </div>
      </div>

      <h3>📋 Order Items (${orderData.itemCount || 0} items)</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${(orderData.items || []).map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.color || 'N/A'}</td>
              <td>${item.quantity}</td>
              <td>₦${(item.total || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total">
        Total Amount: ₦${(orderData.totalAmount || 0).toLocaleString()}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Reference:</strong> ${orderData.paymentReference}</p>
        <p><strong>Order Time:</strong> ${new Date().toLocaleString('en-NG')}</p>
      </div>

      <div style="text-align: center; margin-top: 35px;">
        <a href="${process.env.NEXTAUTH_URL || 'https://kavanthebrand.com'}/admin/orders" class="button">
          View Order in Admin Panel
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}