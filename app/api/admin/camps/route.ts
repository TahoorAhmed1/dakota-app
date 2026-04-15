import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for camp data
interface CampData {
  id?: string;
  name: string;
  slug: string;
  nightlyLodgingRate: number | string;
  minGroupSize: number;
  lodgingCapacity: number;
  isActive: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const camps = await prisma.camp.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        nightlyLodgingRate: true,
        isActive: true,
        displayOrder: true,
        // Note: minGroupSize and lodgingCapacity aren't in your schema's Camp model
        // But are used in your API routes - you should add them to the model if needed
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(camps);
  } catch (error) {
    console.error('Error fetching camps:', error);
    return NextResponse.json(
      { error: "Failed to fetch camps" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CampData = await req.json();
    
    // Validation
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const camp = await prisma.camp.create({
      data: {
        name: body.name,
        slug: body.slug,
        nightlyLodgingRate: Number(body.nightlyLodgingRate),
        isActive: body.isActive ?? true, // default to true if not provided
        displayOrder: 0, // You may want to calculate this
        // Note: Add minGroupSize and lodgingCapacity to your model if needed
      },
    });

    return NextResponse.json(camp, { status: 201 });
  } catch (error) {
    console.error('Error creating camp:', error);
    return NextResponse.json(
      { error: "Camp creation failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: CampData = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Camp ID is required for update" },
        { status: 400 }
      );
    }

    const camp = await prisma.camp.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
        nightlyLodgingRate: Number(body.nightlyLodgingRate),
        isActive: body.isActive,
        // Add other fields as needed
      },
    });

    return NextResponse.json(camp);
  } catch (error) {
    console.error('Error updating camp:', error);
    return NextResponse.json(
      { error: "Camp update failed" },
      { status: 500 }
    );
  }
}
