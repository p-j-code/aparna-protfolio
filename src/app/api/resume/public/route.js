import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // Get the latest published PDF
    const { blobs } = await list({
      prefix: "public/",
      limit: 1,
    });

    if (blobs.length > 0) {
      const latestPdf = blobs[0];
      return NextResponse.json({
        success: true,
        pdfUrl: latestPdf.url,
        fileName: latestPdf.pathname,
        updatedAt: latestPdf.uploadedAt,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "No published resume found",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching public resume:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch resume",
      },
      { status: 500 }
    );
  }
}
