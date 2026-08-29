import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // Required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Minimum password validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const manager = await prisma.manager.findUnique({
      where: {
        email,
      },
    });

    // Same message for wrong email/password
    // Better for security
    if (!manager) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password.",
        },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      manager.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password.",
        },
        { status: 401 }
      );
    }

    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      console.error("AUTH_SECRET is not configured.");

      return NextResponse.json(
        {
          success: false,
          message:
            "Login service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    const token = await new SignJWT({
      managerId: manager.id,
      email: manager.email,
      name: manager.name,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(
        new TextEncoder().encode(secret)
      );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(
      "manager_session",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Manager login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to login right now. Please try again.",
      },
      { status: 500 }
    );
  }
}