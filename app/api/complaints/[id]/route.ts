import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const complaintId = Number(id);

    if (Number.isNaN(complaintId)) {
      return NextResponse.json(
        { message: "Invalid complaint ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = [
      "NEW",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.update({
      where: {
        id: complaintId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Status update error:", error);

    return NextResponse.json(
      { message: "Unable to update complaint status." },
      { status: 500 }
    );
  }
}