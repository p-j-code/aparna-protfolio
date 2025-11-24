"use client";

/**
 * Client-safe utilities for portfolio functionality
 * Note: Server-side functions have been moved to portfolio-utils-server.js
 */

// Re-export the server functions for convenience
// They will only be included in server components that import them
export {
  getPortfolioData,
  updatePortfolioData,
} from "./portfolio-utils-server";

/**
 * Client-side password validation function for portfolio editing
 * Uses NEXT_PUBLIC_PORTFOLIO_PASSWORD environment variable
 */
export function checkPortfolioPassword(password) {
  // For client-side usage, we need to use NEXT_PUBLIC_ environment variables
  const validPassword = process.env.NEXT_PUBLIC_PORTFOLIO_PASSWORD;
  return password === validPassword;
}
