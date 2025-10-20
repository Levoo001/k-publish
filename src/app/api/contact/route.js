// src/app/api/contact/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Send email to admin using Resend
    const { data, error } = await resend.emails.send({
      from: 'Kavan The Brand <contact@kavanthebrand.com>',
      to: 'admin@kavanthebrand.com',
      subject: `New Contact Form: ${subject || 'General Inquiry'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #3A0303; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3A0303; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fdf2f2; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="field">
                <span class="label">Phone:</span> ${phone || 'Not provided'}
              </div>
              <div class="field">
                <span class="label">Subject:</span> ${subject || 'General Inquiry'}
              </div>
              <div class="field">
                <span class="label">Message:</span>
                <p>${message}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending contact form email:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        data: {
          name,
          email,
          subject: subject || 'General Inquiry'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}