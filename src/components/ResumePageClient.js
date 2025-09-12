"use client";

import { useState, useEffect } from "react";
import PasswordProtection from "@/components/PasswordProtection";
import ResumeEditor from "@/components/ResumeEditor";
import ResumeViewer from "@/components/ResumeViewer";

export default function ResumePageClient({ initialData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("view"); // 'view' or 'edit'

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
  };

  const toggleMode = () => {
    setMode(mode === "view" ? "edit" : "view");
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div>
      <div className="fixed top-4 left-4 z-10 print:hidden">
        <div className="flex space-x-2">
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded shadow"
          >
            {mode === "view" ? "Switch to Editor" : "Switch to Viewer"}
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded shadow"
          >
            Sign Out
          </button>
        </div>
      </div>

      {mode === "view" ? (
        <ResumeViewer resumeData={initialData} password={password} />
      ) : (
        <ResumeEditor initialData={initialData} password={password} />
      )}
    </div>
  );
}
