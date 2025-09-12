import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { tokenPayload } = body;

    // Verify this is coming from an authenticated user
    // You might want to add additional verification here

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Optionally validate pathname or add metadata
        return {
          allowedContentTypes: ["application/pdf"],
          tokenPayload: pathname,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload completed", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
