"use client";

import { checkPassword } from "@/lib/resume-utils";
import { useState, useEffect } from "react";

/**
 * Password protection component for the resume editor
 *
 * This component:
 * 1. Checks for existing valid session on initial load
 * 2. If no valid session exists, displays the password form
 * 3. Validates password against NEXT_PUBLIC_RESUME_PASSWORD
 * 4. Stores valid passwords in sessionStorage for persistence
 */
export default function PasswordProtection({
  onAuthenticated,
  isAdminRoute = false,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session authentication on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      const storedPassword = sessionStorage.getItem("resumePassword");
      if (storedPassword && checkPassword(storedPassword)) {
        // If stored password is valid, authenticate immediately
        onAuthenticated(storedPassword);
      }
    };

    checkExistingSession();
  }, [onAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate locally first to save a potentially unnecessary API call
      if (!password.trim()) {
        setError("Password is required");
        setIsLoading(false);
        return;
      }

      // Check password locally
      if (checkPassword(password)) {
        // Store password in session storage (this will be used for API calls)
        sessionStorage.setItem("resumePassword", password);

        // Call onAuthenticated with the password
        onAuthenticated(password);
        return;
      } else {
        setError("Invalid password");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdminRoute ? "Admin Access" : "Resume Editor"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isAdminRoute
              ? "Enter password to access the admin area"
              : "Enter password to access the resume editor"}
          </p>
          {!isAdminRoute && (
            <p className="mt-1 text-xs text-purple-600">
              You can view the resume without logging in, but editing requires
              authentication.
            </p>
          )}
          {isAdminRoute && (
            <p className="mt-1 text-xs text-purple-600">
              <a href="/resume" className="underline hover:text-purple-800">
                Return to public view
              </a>
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400"
            >
              {isLoading ? "Authenticating..." : "Access Editor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
