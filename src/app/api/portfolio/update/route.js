import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  updatePortfolioData,
  checkPortfolioPassword,
} from "@/lib/portfolio-utils-server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Verify password
    const isValid = await checkPortfolioPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Update the portfolio data
    const result = await updatePortfolioData(data);

    if (result.success) {
      // Revalidate the cache to ensure fresh data
      try {
        revalidatePath("/");
        revalidatePath("/projects");
      } catch (error) {
        console.log("Cache revalidation error:", error);
      }

      return NextResponse.json({
        success: true,
        message: "Portfolio updated successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Failed to update portfolio",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in portfolio update API:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
