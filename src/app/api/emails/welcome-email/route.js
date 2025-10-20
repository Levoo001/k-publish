// src/app/api/auth/welcome-email/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Kavan The Brand <admin@kavanthebrand.com>',
      to: email,
      subject: 'Welcome to Kavan The Brand! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #3A0303; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3A0303; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #fdf2f2; }
            .button { background: #3A0303; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kavan The Brand! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Welcome to our community of elegance and style! We're thrilled to have you join us.</p>
              
              <h3>Your Account Benefits:</h3>
              <ul>
                <li>✅ 10% off your first order</li>
                <li>✅ Exclusive access to new collections</li>
                <li>✅ Faster checkout experience</li>
                <li>✅ Order tracking and history</li>
              </ul>
              
              <p>Start exploring our latest collections:</p>
              <a href="${process.env.NEXTAUTH_URL}/shop" class="button">Start Shopping</a>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #3A0303;">
                Need help? Contact us at <a href="mailto:admin@kavanthebrand.com">admin@kavanthebrand.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}