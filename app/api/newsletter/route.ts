import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from "@/lib/prisma";

function isDatabaseUnavailable(error: unknown) {
  return error instanceof Prisma.PrismaClientInitializationError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);

    if (isDatabaseUnavailable(error)) {
      return NextResponse.json(
        {
          error: 'Newsletter signups are temporarily unavailable. Please try again in a few minutes.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}