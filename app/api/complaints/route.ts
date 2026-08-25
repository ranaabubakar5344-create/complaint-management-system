import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendComplaintEmails } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      subject,
      description,
      isAnonymous,
    } = body;

    // Basic validation
    if (!subject?.trim() || !description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject and complaint details are required.",
        },
        { status: 400 }
      );
    }

    // Load current system settings
    const settings = await prisma.systemSetting.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        id: 1,
      },
    });

    // Anonymous submissions can be disabled from Settings
    if (isAnonymous && !settings.allowAnonymous) {
      return NextResponse.json(
        {
          success: false,
          message: "Anonymous complaints are currently disabled.",
        },
        { status: 400 }
      );
    }

    // Identified complaint requires name + email
    if (!isAnonymous && (!fullName?.trim() || !email?.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name and email are required.",
        },
        { status: 400 }
      );
    }

    // Phone can be made mandatory from Settings
    if (
      !isAnonymous &&
      settings.requirePhone &&
      !phone?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();

    // Generate reference + save complaint in one DB transaction
    const complaint = await prisma.$transaction(async (tx) => {
      const counter = await tx.complaintCounter.upsert({
        where: {
          year: currentYear,
        },
        update: {
          lastValue: {
            increment: 1,
          },
        },
        create: {
          year: currentYear,
          lastValue: 1,
        },
      });

      const referenceNo = `CMP-${currentYear}-${String(
        counter.lastValue
      ).padStart(6, "0")}`;

      return tx.complaint.create({
        data: {
          referenceNo,
          fullName: isAnonymous ? null : fullName.trim(),
          email: isAnonymous ? null : email.trim(),
          phone: isAnonymous
            ? null
            : phone?.trim() || null,
          isAnonymous: Boolean(isAnonymous),
          subject: subject.trim(),
          description: description.trim(),
          status: "NEW",
        },
      });
    });

    // Send emails without delaying the success response
    try {
  await sendComplaintEmails({
    userEmail: complaint.email,
    userName: complaint.fullName,
    phone: complaint.phone,
    referenceNo: complaint.referenceNo,
    subject: complaint.subject,
    description: complaint.description,
    isAnonymous: complaint.isAnonymous,
  });
} catch (emailError) {
  console.error("Email sending failed:", emailError);
}

    return NextResponse.json(
      {
        success: true,
        message: "Complaint submitted successfully.",
        referenceNo: complaint.referenceNo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complaint submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit complaint. Please try again.",
      },
      { status: 500 }
    );
  }
}