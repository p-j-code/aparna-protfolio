"use client";

import { useState, useEffect } from "react";
import PasswordProtection from "@/components/PasswordProtection";
import ResumeEditor from "@/components/ResumeEditor";
import ResumeViewer from "@/components/ResumeViewer";

export default function ResumePageClient({ initialData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("view"); // 'view' or 'edit'
  const [resumeData, setResumeData] = useState(initialData);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu

  // Check if user has password in session storage
  useEffect(() => {
    const storedPassword = sessionStorage.getItem("resumePassword");
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
    sessionStorage.removeItem("resumePassword");
    setIsAuthenticated(false);
    setPassword("");
    setMode("view");
    setMenuOpen(false);
  };

  const toggleMode = () => {
    setMode(mode === "view" ? "edit" : "view");
    setMenuOpen(false);
  };

  const handleDataUpdate = (newData) => {
    setResumeData(newData);
    setMode("view");
  };

  const handlePrint = () => {
    setMenuOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div>
      {/* Desktop Floating Buttons - Top Left */}
      <div className="hidden sm:block fixed top-4 left-4 z-50 print:hidden">
        <div className="flex space-x-2">
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded shadow-lg transition-all hover:shadow-xl"
          >
            {mode === "view" ? "Switch to Editor" : "Switch to Viewer"}
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded shadow-lg transition-all hover:shadow-xl"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Desktop Print Button - Top Right (only in view mode) */}
      {mode === "view" && (
        <div className="hidden sm:block fixed top-4 right-4 z-50 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded shadow-lg transition-all hover:shadow-xl"
          >
            Print Resume
          </button>
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <div className="sm:hidden print:hidden">
        {/* Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* FAB Menu Items */}
        <div
          className={`fixed bottom-20 right-4 z-50 flex flex-col gap-3 transition-all transform ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0 pointer-events-none"
          }`}
        >
          {/* Sign Out Button */}
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

          {/* Toggle Mode Button */}
          <button
            onClick={toggleMode}
            className="flex items-center justify-end gap-3 bg-white rounded-full shadow-lg pr-2 transition-all hover:shadow-xl"
          >
            <span className="px-3 py-1 text-sm font-medium text-gray-700">
              {mode === "view" ? "Edit Resume" : "View Resume"}
            </span>
            <div className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full">
              {mode === "view" ? (
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </div>
          </button>

          {/* Print Button (only in view mode) */}
          {mode === "view" && (
            <button
              onClick={handlePrint}
              className="flex items-center justify-end gap-3 bg-white rounded-full shadow-lg pr-2 transition-all hover:shadow-xl"
            >
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Print
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Main FAB Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl active:scale-95 ${
            menuOpen ? "rotate-45" : ""
          }`}
        >
          <svg
            className="w-6 h-6 transition-transform"
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

      {/* Quick Action Bar for Tablets (optional) */}
      <div className="hidden md:hidden sm:flex fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 print:hidden bg-white rounded-full shadow-lg px-2 py-2">
        <div className="flex space-x-2">
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-full text-sm transition-colors"
          >
            {mode === "view" ? "Edit" : "View"}
          </button>
          {mode === "view" && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-full text-sm transition-colors"
            >
              Print
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-full text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      {mode === "view" ? (
        <ResumeViewer
          resumeData={resumeData}
          password={password}
          // Pass a prop to hide the print button since we're handling it here
          hidePrintButton={true}
        />
      ) : (
        <ResumeEditor
          initialData={resumeData}
          password={password}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
}
