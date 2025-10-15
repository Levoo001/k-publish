// src/app/api/contact/route.js

import { NextResponse } from 'next/server';

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

    // For now, let's log the data and return success
    // You can integrate with your email service later
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Simulate email sending (replace this with actual email service)
    console.log('📧 Email would be sent to: admin@kavanthebrand.com');
    console.log('📧 Confirmation email would be sent to:', email);

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