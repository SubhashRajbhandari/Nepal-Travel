import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getCurrentUser();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ message: "Unauthorized." }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 }),
    };
  }

  return { session, response: null };
}
