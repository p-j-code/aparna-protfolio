import { put, head, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export async function getResumeData() {
  try {
    if (isProduction) {
      // Try to get from Blob storage
      try {
        const { blobs } = await list({ prefix: "resume-data" });
        if (blobs.length > 0) {
          const response = await fetch(blobs[0].url);
          return await response.json();
        }
      } catch (error) {
        console.log("No existing data in blob, initializing...");
      }

      // Initialize with default data if doesn't exist
      const filePath = path.join(process.cwd(), "src/data/resume-data.json");
      const fileData = await fs.readFile(filePath, "utf8");
      const defaultData = JSON.parse(fileData);

      // Save to blob for future use
      await put("resume-data.json", JSON.stringify(defaultData), {
        access: "public",
        contentType: "application/json",
      });

      return defaultData;
    } else {
      // Development: use file system
      const filePath = path.join(process.cwd(), "src/data/resume-data.json");
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading resume data:", error);
    const filePath = path.join(process.cwd(), "src/data/resume-data.json");
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  }
}

export async function updateResumeData(newData) {
  try {
    if (isProduction) {
      // Save to Vercel Blob
      const blob = await put(
        "resume-data.json",
        JSON.stringify(newData, null, 2),
        {
          access: "public",
          contentType: "application/json",
        }
      );

      // Optional: Create backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await put(
        `backups/resume-data-${timestamp}.json`,
        JSON.stringify(newData, null, 2),
        {
          access: "public",
          contentType: "application/json",
        }
      );

      return { success: true };
    } else {
      // Development: save to file system
      const filePath = path.join(process.cwd(), "src/data/resume-data.json");
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating resume data:", error);
    return { success: false, error: error.message };
  }
}

export function checkPassword(password) {
  return password === process.env.RESUME_PASSWORD;
}
