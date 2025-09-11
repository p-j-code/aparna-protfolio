import { NextResponse } from "next/server";
import { checkPassword, updateResumeData } from "@/lib/resume-utils";

export async function POST(request) {
  try {
    const { password, data } = await request.json();

    // Check if password is valid
    if (!checkPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Update resume data
    const result = await updateResumeData(data);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: "Resume updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to update resume" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
