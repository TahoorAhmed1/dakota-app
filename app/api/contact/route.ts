import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email to admin
    // 3. Send confirmation email to user

    console.log('Contact form submission:', body);

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}