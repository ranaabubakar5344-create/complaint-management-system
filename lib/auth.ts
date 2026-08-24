import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type ManagerSession = {
  managerId: number;
  email: string;
  name: string;
};

export async function getManagerSession(): Promise<ManagerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("manager_session")?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (
      typeof payload.managerId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      managerId: payload.managerId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}