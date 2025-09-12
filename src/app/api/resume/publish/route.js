import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, pdfBase64, fileName } = body;

    // Validate password
    if (!password || password !== process.env.RESUME_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // Save to Vercel Blob
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Save current version (overwrite)
    const currentBlob = await put(`public/${fileName}`, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      allowOverwrite: true,
    });

    // Save timestamped backup
    await put(
      `public/archives/${fileName.replace(".pdf", "")}-${timestamp}.pdf`,
      pdfBuffer,
      {
        access: "public",
        contentType: "application/pdf",
      }
    );

    return NextResponse.json({
      success: true,
      message: "Resume published successfully",
      pdfUrl: currentBlob.url,
      downloadUrl: currentBlob.downloadUrl || currentBlob.url,
    });
  } catch (error) {
    console.error("Error publishing resume:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
