// src/app/api/emails/order-confirmation/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const orderData = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Kavan The Brand <orders@kavanthebrand.com>',
      to: orderData.customerEmail,
      subject: `Order Confirmed - #${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #3A0303; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3A0303; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #fdf2f2; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed! 🎉</h1>
              <p>Thank you for your order, ${orderData.customerName}!</p>
            </div>
            <div class="content">
              <h2>Order #${orderData.orderId}</h2>
              
              <div class="order-details">
                <h3>Shipping Information</h3>
                <p><strong>Address:</strong> ${orderData.shippingAddress}</p>
                <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
                <p><strong>Shipping Method:</strong> ${orderData.shippingProvider}</p>
                
                <h3>Order Items</h3>
                ${orderData.items.map(item => `
                  <div class="item">
                    <span>${item.name} (Qty: ${item.quantity})</span>
                    <span>₦${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                `).join('')}
                
                <div style="border-top: 2px solid #3A0303; margin-top: 20px; padding-top: 10px;">
                  <div class="item">
                    <strong>Total: ₦${orderData.totalAmount.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
              
              <p><strong>Expected Delivery:</strong> ${orderData.shippingType === 'international' ? '5-10 business days' : '2-5 business days'}</p>
              
              <p>We'll notify you when your order ships. Track your order anytime from your account.</p>
              
              <a href="${process.env.NEXTAUTH_URL}/account/orders" class="button" style="background: #3A0303; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                View Your Orders
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}