import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation - you might want more comprehensive validation
    if (!body.groupData || !body.hunters || !body.pricing) {
      return NextResponse.json(
        { error: 'Missing required quote data' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save quote to database
    // 2. Generate quote ID
    // 3. Send email with quote details
    // 4. Send confirmation to user

    console.log('Quote request:', body);

    // Generate a simple quote ID
    const quoteId = `Q${Date.now()}`;

    return NextResponse.json({
      success: true,
      quoteId,
      message: 'Your quote request has been submitted successfully! We will contact you within 24 hours with your personalized quote.',
      data: body
    });

  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}