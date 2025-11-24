"use server";

import { put, list, del } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Server-side function to get portfolio data
 */
export async function getPortfolioData() {
  try {
    if (isProduction) {
      // Try to get from Blob storage
      try {
        const { blobs } = await list({ prefix: "portfolio-data" });
        if (blobs.length > 0) {
          // Get the most recent blob
          const sortedBlobs = blobs.sort(
            (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
          );
          const response = await fetch(sortedBlobs[0].url);
          return await response.json();
        }
      } catch (error) {
        console.log("No existing portfolio data in blob, initializing...");
      }

      // Initialize with default data if doesn't exist
      const filePath = path.join(process.cwd(), "src/data/portfolio-data.json");
      const fileData = await fs.readFile(filePath, "utf8");
      const defaultData = JSON.parse(fileData);

      // Save to blob for future use
      await put("portfolio-data.json", JSON.stringify(defaultData), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });

      return defaultData;
    } else {
      // Development: use file system
      const filePath = path.join(process.cwd(), "src/data/portfolio-data.json");
      const fileData = await fs.readFile(filePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    // Fallback to direct file read
    const filePath = path.join(process.cwd(), "src/data/portfolio-data.json");
    const fileData = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileData);
  }
}

/**
 * Server-side function to update portfolio data
 */
export async function updatePortfolioData(newData) {
  try {
    if (isProduction) {
      // Delete old blob if exists
      try {
        const { blobs } = await list({ prefix: "portfolio-data.json" });
        for (const blob of blobs) {
          await del(blob.url);
        }
      } catch (error) {
        console.log("No existing portfolio blob to delete");
      }

      // Save new data to Vercel Blob
      const blob = await put(
        "portfolio-data.json",
        JSON.stringify(newData, null, 2),
        {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false,
        }
      );

      // Create backup with unique timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await put(
        `backups/portfolio-data-${timestamp}.json`,
        JSON.stringify(newData, null, 2),
        {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false,
        }
      );

      console.log("Portfolio data updated successfully in blob storage");
      return { success: true, url: blob.url };
    } else {
      // Development: save to file system
      const filePath = path.join(process.cwd(), "src/data/portfolio-data.json");
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
      console.log("Portfolio data updated successfully in file system");
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server-side password validation function for portfolio editing
 * Uses PORTFOLIO_PASSWORD environment variable
 */
export async function checkPortfolioPassword(password) {
  return password === process.env.PORTFOLIO_PASSWORD;
}
