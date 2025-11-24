"use client";

import { useState, useEffect } from "react";
import PortfolioPasswordProtection from "@/components/PortfolioPasswordProtection";
import ProjectsEditor from "@/components/ProjectsEditor";
import Link from "next/link";

export default function ProjectsPageClient({
  initialData,
  viewOnly = false,
  requireAuth = false,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [portfolioData, setPortfolioData] = useState(initialData);

  // Check if user has password in session storage
  useEffect(() => {
    const storedPassword = sessionStorage.getItem("portfolioPassword");
    if (storedPassword) {
      setIsAuthenticated(true);
      setPassword(storedPassword);
    }
  }, []);

  const handleAuthenticated = (pwd) => {
    setIsAuthenticated(true);
    setPassword(pwd);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("portfolioPassword");
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleDataUpdate = (newData) => {
    setPortfolioData(newData);
  };

  // Show authentication screen if requireAuth is true and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <PortfolioPasswordProtection
        onAuthenticated={handleAuthenticated}
        isAdminRoute={requireAuth}
      />
    );
  }

  return (
    <div>
      {/* Desktop Floating Buttons - Top Left */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <div className="flex space-x-2">
          {isAuthenticated && (
            <>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded shadow-lg transition-all hover:shadow-xl"
              >
                Sign Out
              </button>

              <Link
                href="/"
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded shadow-lg transition-all hover:shadow-xl inline-block"
              >
                Back to Portfolio
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="sm:hidden">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" />

        {/* FAB Menu Items */}
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3">
          {isAuthenticated && (
            <>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-end gap-3 bg-white rounded-full shadow-lg pr-2 transition-all hover:shadow-xl"
              >
                <span className="px-3 py-1 text-sm font-medium text-gray-700">
                  Sign Out
                </span>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </button>

              <Link
                href="/"
                className="flex items-center justify-end gap-3 bg-white rounded-full shadow-lg pr-2 transition-all hover:shadow-xl"
              >
                <span className="px-3 py-1 text-sm font-medium text-gray-700">
                  Portfolio
                </span>
                <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Main FAB Toggle Button - Always visible */}
        <button className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Main Content - Always show editor for admin route */}
      <ProjectsEditor
        initialData={portfolioData}
        password={password}
        onDataUpdate={handleDataUpdate}
      />
    </div>
  );
}
