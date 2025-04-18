"use server";

import { NextResponse } from 'next/server';
import { sendEmail } from "@/lib/sendgrid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, token, task } = body;

    const result = await sendEmail(to, token, task);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}