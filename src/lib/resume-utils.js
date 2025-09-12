"use client";

/**
 * Client-safe utilities for resume functionality
 * Note: Server-side functions have been moved to resume-utils-server.js
 */

// Re-export the server functions for convenience
// They will only be included in server components that import them
export { getResumeData, updateResumeData } from "./resume-utils-server";

/**
 * Client-side password validation function
 * Uses NEXT_PUBLIC_RESUME_PASSWORD environment variable
 */
export function checkPassword(password) {
  // For client-side usage, we need to use NEXT_PUBLIC_ environment variables
  const validPassword = process.env.NEXT_PUBLIC_RESUME_PASSWORD;
  return password === validPassword;
}
