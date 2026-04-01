// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Validate required fields
//     const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { error: `${field} is required` },
//           { status: 400 }
//         );
//       }
//     }

//     // Here you would typically:
//     // 1. Save to database
//     // 2. Send email to admin
//     // 3. Send confirmation email to user

//     console.log('Contact form submission:', body);

//     // For now, just return success
//     return NextResponse.json({
//       success: true,
//       message: 'Thank you for your message. We will get back to you within 24 hours.'
//     });

//   } catch (error) {
//     console.error('Contact form error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ContactPayload = {
  huntType?: string;
  experience?: string;
  minGroupSize?: string;
  maxGroupSize?: string;
  dogPower?: string;
  firstChoice?: string;
  secondChoice?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  stateProvince?: string;
  phone?: string;
  additionalComments?: string;
  honeypot?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;

    if (body.honeypot) {
      return NextResponse.json(
        { error: "Spam detected." },
        { status: 400 }
      );
    }

    const requiredFields: Array<keyof ContactPayload> = [
      "huntType",
      "experience",
      "minGroupSize",
      "maxGroupSize",
      "dogPower",
      "firstChoice",
      "secondChoice",
      "firstName",
      "lastName",
      "email",
      "stateProvince",
      "phone",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!isValidEmail(String(body.email))) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (Number(body.minGroupSize) > Number(body.maxGroupSize)) {
      return NextResponse.json(
        { error: "Max group size must be greater than or equal to min group size." },
        { status: 400 }
      );
    }

    if (body.firstChoice === body.secondChoice) {
      return NextResponse.json(
        { error: "Second choice must be different from first choice." },
        { status: 400 }
      );
    }

    const submission = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    await prisma.contactSubmission.create({
      data: {
        huntType: String(body.huntType),
        experience: String(body.experience),
        minGroupSize: String(body.minGroupSize),
        maxGroupSize: String(body.maxGroupSize),
        dogPower: String(body.dogPower),
        firstChoice: String(body.firstChoice),
        secondChoice: String(body.secondChoice),
        firstName: String(body.firstName),
        lastName: String(body.lastName),
        email: String(body.email),
        stateProvince: String(body.stateProvince),
        phone: String(body.phone),
        additionalComments: body.additionalComments ? String(body.additionalComments) : null,
      },
    });

    if (process.env.CONTACT_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { error: "Submission failed while forwarding to webhook." },
          { status: 502 }
        );
      }
    } else {
      console.log("CONTACT FORM SUBMISSION:", submission);
    }

    return NextResponse.json({
      message: "Thank you. Your request has been submitted successfully.",
    });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong while submitting the form." },
      { status: 500 }
    );
  }
}