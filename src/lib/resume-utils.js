// Authentication helpers
export function checkPassword(password) {
  // You should use a more secure method in production
  // This is just a simple example
  return password === process.env.RESUME_PASSWORD;
}

// File operations helpers
import { promises as fs } from "fs";
import path from "path";

export async function getResumeData() {
  const filePath = path.join(process.cwd(), "src/data/resume-data.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading resume data:", error);
    return null;
  }
}

export async function updateResumeData(newData) {
  const filePath = path.join(process.cwd(), "src/data/resume-data.json");
  try {
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error updating resume data:", error);
    return { success: false, error: error.message };
  }
}
