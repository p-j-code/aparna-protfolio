import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, pdfUrl, fileName } = body;

    // Validate password
    if (!password || password !== process.env.RESUME_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Save the URL reference for portfolio access
    const metadata = {
      url: pdfUrl,
      fileName: fileName,
      updatedAt: new Date().toISOString(),
    };

    // Save metadata as JSON
    await put("public/resume-metadata.json", JSON.stringify(metadata), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      message: "PDF URL saved successfully",
    });
  } catch (error) {
    console.error("Error saving URL:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
