"use client";

import { useState, useRef } from "react";
import PDFGenerator from "./PDFGenerator";
import ResumeDownload from "./ResumeDownload";

export default function ResumeViewer({
  resumeData,
  password,
  hidePrintButton = false,
}) {
  const [isPrinting, setIsPrinting] = useState(false);
  const resumeRef = useRef(null);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      {/* Inter Font Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
      `}</style>

      {/* Print Button - Mobile Optimized (only show if not hidden) */}
      {!isPrinting && !hidePrintButton && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 print:hidden flex gap-2 sm:gap-3">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white hover:bg-purple-700 rounded shadow-lg transition-colors text-sm sm:text-base"
          >
            Print Resume
          </button>
          {/* <ResumeDownload />
          {password && (
            <PDFGenerator resumeData={resumeData} password={password} />
          )} */}
        </div>
      )}

      {/* Resume Container - Mobile Responsive */}
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 print:py-0 print:bg-white px-2 sm:px-4 print:px-0">
        <div
          id="resume-content"
          ref={resumeRef}
          className="relative max-w-full sm:max-w-[8.5in] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none rounded-lg sm:rounded-none print:rounded-none"
          style={{ minHeight: "11in" }}
        >
          {/* Subtle Top Accent */}
          <div
            className="h-1 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg sm:rounded-t-none print:rounded-t-none"
            style={{
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
            }}
          />

          {/* Content Container - Mobile Responsive */}
          <div className="relative px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8 print:px-8 print:py-6">
            {/* Header Section - Mobile Optimized */}
            <header className="text-center mb-4 pb-3 sm:mb-6 sm:pb-4 print:mb-4 print:pb-3">
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-500 bg-clip-text mb-2 tracking-tight print:text-3xl"
                style={{
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              >
                {resumeData.name.toUpperCase()}
              </h1>
              <div className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 print:text-base">
                {resumeData.title}
              </div>

              {/* Contact Info - Mobile Responsive */}
              <div className="text-xs sm:text-sm text-gray-600 mb-2 print:text-xs flex flex-col sm:flex-row sm:justify-center items-center gap-1 sm:gap-0">
                <span>{resumeData.contact.location}</span>
                <span className="hidden sm:inline mx-2 text-purple-400">•</span>
                <span>{resumeData.contact.phone}</span>
                <span className="hidden sm:inline mx-2 text-purple-400">•</span>
                <span className="break-all">{resumeData.contact.email}</span>
              </div>

              {/* Social Links - Mobile Responsive */}
              <div className="text-xs sm:text-sm space-y-1 sm:space-y-0 sm:space-x-3 print:text-xs print:space-y-0 print:space-x-3">
                {resumeData.contact.website && (
                  <a
                    href={`https://${resumeData.contact.website.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block sm:inline text-purple-600 hover:text-pink-500 transition-colors font-medium"
                    style={{ printColorAdjust: "exact" }}
                  >
                    Portfolio
                  </a>
                )}
                {resumeData.contact.social?.linkedin && (
                  <>
                    <span className="hidden sm:inline text-gray-400 print:inline">
                      |
                    </span>
                    <a
                      href={resumeData.contact.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block sm:inline text-purple-600 hover:text-pink-500 transition-colors font-medium"
                      style={{ printColorAdjust: "exact" }}
                    >
                      LinkedIn
                    </a>
                  </>
                )}
                {resumeData.contact.social?.behance && (
                  <>
                    <span className="hidden sm:inline text-gray-400 print:inline">
                      |
                    </span>
                    <a
                      href={resumeData.contact.social.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block sm:inline text-purple-600 hover:text-pink-500 transition-colors font-medium"
                      style={{ printColorAdjust: "exact" }}
                    >
                      Behance
                    </a>
                  </>
                )}
                {resumeData.contact.social?.behance2 && (
                  <>
                    <span className="hidden sm:inline text-gray-400 print:inline">
                      |
                    </span>
                    <a
                      href={resumeData.contact.social.behance2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block sm:inline text-purple-600 hover:text-pink-500 transition-colors font-medium"
                      style={{ printColorAdjust: "exact" }}
                    >
                      Behance 2
                    </a>
                  </>
                )}
              </div>
            </header>

            {/* Professional Summary - Mobile Responsive */}
            <section className="mb-4 sm:mb-6 print:mb-4">
              <h2
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 sm:mb-3 pb-1 border-b-2 border-purple-200 print:mb-2 print:text-sm"
                style={{ printColorAdjust: "exact" }}
              >
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed print:text-xs">
                {resumeData.summary}
                {resumeData.summary.includes("Nataraj") && (
                  <span
                    className="font-semibold text-purple-600"
                    style={{ printColorAdjust: "exact" }}
                  >
                    {" "}
                    (10, 12, and 24 colour pencils)
                  </span>
                )}
              </p>
            </section>

            {/* Professional Experience - Mobile Responsive */}
            <section className="mb-4 sm:mb-6 print:mb-4">
              <h2
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 sm:mb-3 pb-1 border-b-2 border-purple-200 print:mb-2 print:text-sm"
                style={{ printColorAdjust: "exact" }}
              >
                Professional Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-3 sm:mb-4 print:mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 print:text-sm">
                        {exp.position}
                      </h3>
                      <span
                        className="text-xs sm:text-sm font-medium text-purple-600 print:text-xs"
                        style={{ printColorAdjust: "exact" }}
                      >
                        {exp.company}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 print:text-xs">
                        {" "}
                        — {exp.location || "Mumbai"}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 italic mt-1 sm:mt-0 print:text-xs print:mt-0">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-relaxed print:text-xs">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="ml-4 sm:ml-5 space-y-1 print:ml-4">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-xs sm:text-sm text-gray-600 list-disc marker:text-purple-400 print:text-xs"
                          style={{ printColorAdjust: "exact" }}
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Key Projects & Achievements - Mobile Responsive */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-4 sm:mb-6 print:mb-4">
                <h2
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 sm:mb-3 pb-1 border-b-2 border-purple-200 print:mb-2 print:text-sm"
                  style={{ printColorAdjust: "exact" }}
                >
                  Key Projects & Achievements
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-2 sm:mb-3 print:mb-2">
                    <h4
                      className="text-xs sm:text-sm font-semibold text-purple-600 mb-1 print:text-xs"
                      style={{ printColorAdjust: "exact" }}
                    >
                      {project.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-2 print:text-xs">
                      {project.description}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Core Competencies - Mobile Responsive */}
            <section className="mb-4 sm:mb-6 print:mb-4">
              <h2
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 sm:mb-3 pb-1 border-b-2 border-purple-200 print:mb-2 print:text-sm"
                style={{ printColorAdjust: "exact" }}
              >
                Core Competencies
              </h2>

              {resumeData.skillsConfig?.enableCategories &&
              resumeData.skillsConfig?.categories ? (
                // Categorized Display - Mobile Responsive
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print:grid-cols-2 print:gap-3">
                  {resumeData.skillsConfig.categories.map((category, index) => (
                    <div
                      key={index}
                      className="border-l-3 border-purple-400 pl-2 sm:pl-3 print:pl-2"
                      style={{
                        borderLeftWidth: "3px",
                        printColorAdjust: "exact",
                      }}
                    >
                      <h4
                        className="text-xs sm:text-sm font-semibold text-purple-700 mb-1 sm:mb-2 print:text-xs print:mb-1"
                        style={{ printColorAdjust: "exact" }}
                      >
                        {category.name}
                      </h4>
                      <div className="text-[10px] sm:text-xs text-gray-700 print:text-[10px]">
                        {category.skills?.join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Simple List Display - Mobile Responsive
                <div className="flex flex-wrap gap-1 sm:gap-2 print:gap-1">
                  {(
                    resumeData.skills ||
                    resumeData.skillsConfig?.categories?.flatMap(
                      (cat) => cat.skills || []
                    ) ||
                    []
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-50 border border-purple-300 text-gray-700 rounded text-[10px] sm:text-sm print:text-xs print:px-2 print:py-0.5"
                      style={{ printColorAdjust: "exact" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Education - Mobile Responsive */}
            <section className="mb-4 sm:mb-6 print:mb-4">
              <h2
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 sm:mb-3 pb-1 border-b-2 border-purple-200 print:mb-2 print:text-sm"
                style={{ printColorAdjust: "exact" }}
              >
                Education
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print:grid-cols-2 print:gap-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 print:text-xs">
                      {edu.degree}
                    </h4>
                    <div className="text-[10px] sm:text-xs text-gray-600 print:text-[10px]">
                      {edu.institution}
                      <br />
                      {edu.location}
                    </div>
                    {edu.year && (
                      <div
                        className="text-[10px] sm:text-xs text-purple-600 mt-1 print:text-[10px]"
                        style={{ printColorAdjust: "exact" }}
                      >
                        {edu.year}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Info - Mobile Responsive */}
            <section>
              <div
                className="border-t-2 border-purple-200 pt-2 sm:pt-3 print:pt-2"
                style={{ printColorAdjust: "exact" }}
              >
                <div className="text-[10px] sm:text-xs text-gray-700 space-y-1 print:text-[10px]">
                  {resumeData.additionalInfo?.languages &&
                    resumeData.additionalInfo.languages.length > 0 && (
                      <div className="break-words">
                        <span
                          className="font-semibold text-purple-700"
                          style={{ printColorAdjust: "exact" }}
                        >
                          Languages:
                        </span>{" "}
                        {resumeData.additionalInfo.languages.map(
                          (lang, index) => (
                            <span key={index}>
                              {lang.name} ({lang.level})
                              {index <
                                resumeData.additionalInfo.languages.length -
                                  1 && " • "}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  {resumeData.additionalInfo?.interests &&
                    resumeData.additionalInfo.interests.length > 0 && (
                      <div className="break-words">
                        <span
                          className="font-semibold text-purple-700"
                          style={{ printColorAdjust: "exact" }}
                        >
                          Interests:
                        </span>{" "}
                        {resumeData.additionalInfo.interests.join(" • ")}
                      </div>
                    )}

                  {(resumeData.contact.website ||
                    resumeData.contact.social?.behance ||
                    resumeData.contact.social?.behance2) && (
                    <div className="break-words">
                      <span
                        className="font-semibold text-purple-700"
                        style={{ printColorAdjust: "exact" }}
                      >
                        Portfolio:
                      </span>{" "}
                      {resumeData.contact.website && (
                        <span
                          className="text-purple-600 break-all"
                          style={{ printColorAdjust: "exact" }}
                        >
                          {resumeData.contact.website}
                        </span>
                      )}
                      {resumeData.contact.social?.behance && (
                        <span
                          className="text-purple-600 block sm:inline print:inline"
                          style={{ printColorAdjust: "exact" }}
                        >
                          {resumeData.contact.website ? " • " : ""}
                          behance.net/aparnamunagekar
                        </span>
                      )}
                      {resumeData.contact.social?.behance2 && (
                        <span
                          className="text-purple-600 block sm:inline print:inline"
                          style={{ printColorAdjust: "exact" }}
                        >
                          {" "}
                          • behance.net/aparnamunagekar1
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print Styles with Color Preservation - UNCHANGED */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.3in;
            size: letter;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
              sans-serif;
            margin: 0;
            padding: 0;
          }

          #resume-content {
            width: 100%;
            height: auto;
            min-height: auto;
          }
        }
      `}</style>
    </>
  );
}
