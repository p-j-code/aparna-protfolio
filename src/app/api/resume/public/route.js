import { NextResponse } from "next/server";
import { head } from "@vercel/blob";

export async function GET() {
  try {
    // Get the metadata
    const metadataBlob = await head("public/resume-metadata.json");

    if (metadataBlob) {
      const response = await fetch(metadataBlob.url);
      const metadata = await response.json();

      return NextResponse.json({
        success: true,
        pdfUrl: metadata.url,
        fileName: metadata.fileName,
        updatedAt: metadata.updatedAt,
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
