import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateResumeData, checkPassword } from "@/utils/resume-utils-server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Verify password
    const isValid = await checkPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Update the resume data
    const result = await updateResumeData(data);

    if (result.success) {
      // Revalidate the cache to ensure fresh data
      try {
        revalidatePath("/resume");
        revalidatePath("/");
      } catch (error) {
        console.log("Cache revalidation error:", error);
      }

      return NextResponse.json({
        success: true,
        message: "Resume updated successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to update resume" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in resume update API:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to fetch current data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    // Verify password
    const isValid = await checkPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const { getResumeData } = await import("@/utils/resume-utils-server");
    const data = await getResumeData();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch resume data" },
      { status: 500 }
    );
  }
}
