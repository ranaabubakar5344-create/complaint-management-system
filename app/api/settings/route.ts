import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getManagerSession } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getManagerSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      organizationName,
      systemTitle,
      notificationEmail,
      emailSenderName,
      complaintFormUrl,
      allowAnonymous,
      requirePhone,
    } = body;

    if (!organizationName?.trim() || !systemTitle?.trim()) {
      return NextResponse.json(
        {
          message: "Organization name and system title are required.",
        },
        { status: 400 }
      );
    }

    const settings = await prisma.systemSetting.upsert({
      where: {
        id: 1,
      },
      update: {
        organizationName: organizationName.trim(),
        systemTitle: systemTitle.trim(),
        notificationEmail: notificationEmail?.trim() || null,
        emailSenderName: emailSenderName?.trim() || "Complaint Management System",
        complaintFormUrl: complaintFormUrl?.trim() || null,
        allowAnonymous: Boolean(allowAnonymous),
        requirePhone: Boolean(requirePhone),
      },
      create: {
        id: 1,
        organizationName: organizationName.trim(),
        systemTitle: systemTitle.trim(),
        notificationEmail: notificationEmail?.trim() || null,
        emailSenderName: emailSenderName?.trim() || "Complaint Management System",
        complaintFormUrl: complaintFormUrl?.trim() || null,
        allowAnonymous: Boolean(allowAnonymous),
        requirePhone: Boolean(requirePhone),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully.",
      settings,
    });
  } catch (error) {
    console.error("Settings update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save settings.",
      },
      { status: 500 }
    );
  }
}