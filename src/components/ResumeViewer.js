"use client";

import { useState, useRef } from "react";

export default function ResumeViewer({ resumeData }) {
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

      {/* Print Button */}
      {!isPrinting && (
        <div className="fixed top-4 right-4 z-50 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded shadow-lg transition-colors"
          >
            Print Resume
          </button>
        </div>
      )}

      {/* Resume Container */}
      <div className="min-h-screen bg-gray-50 py-8 print:py-0 print:bg-white">
        <div
          ref={resumeRef}
          className="relative max-w-[8.5in] mx-auto bg-white shadow-lg print:shadow-none"
          style={{ minHeight: "11in" }}
        >
          {/* Gradient Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-600/5 to-pink-500/5 print:hidden" />

          {/* Content Container */}
          <div className="relative px-12 py-10 print:px-12 print:py-8">
            {/* Header Section */}
            {/* Header Section */}
            <header className="text-center mb-6 pb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent print:text-gray-900 mb-1 tracking-tight">
                {resumeData.name.toUpperCase()}
              </h1>
              <div className="text-lg font-medium text-gray-600 mb-2">
                {resumeData.title}
              </div>

              {/* Contact Info - First Line */}
              <div className="text-sm text-gray-600 mb-1">
                <span>{resumeData.contact.location}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span>{resumeData.contact.phone}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span>{resumeData.contact.email}</span>
              </div>

              {/* Social Links - Second Line */}
              <div className="text-sm space-x-2">
                {resumeData.contact.website && (
                  <a
                    href={`https://${resumeData.contact.website.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-pink-500 transition-colors print:text-gray-900 font-medium"
                  >
                    Portfolio
                  </a>
                )}
                {resumeData.contact.social?.linkedin && (
                  <>
                    <span className="text-gray-400">•</span>

                    <a
                      href={resumeData.contact.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-pink-500 transition-colors print:text-gray-900 font-medium"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
                {resumeData.contact.social?.behance && (
                  <>
                    <span className="text-gray-400">•</span>

                    <a
                      href={resumeData.contact.social.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-pink-500 transition-colors print:text-gray-900 font-medium"
                    >
                      Behance
                    </a>
                  </>
                )}
                {resumeData.contact.social?.behance2 && (
                  <>
                    <span className="text-gray-400">•</span>

                    <a
                      href={resumeData.contact.social.behance2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-pink-500 transition-colors print:text-gray-900 font-medium"
                    >
                      Behance 2
                    </a>
                  </>
                )}
              </div>

              {/* Header Border */}
              <div className="h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 mt-4" />
            </header>

            {/* Professional Summary */}
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 pb-1 border-b-2 border-gradient-to-r from-purple-600/50 to-transparent">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">
                {resumeData.summary}
                {resumeData.summary.includes("Nataraj") && (
                  <span className="font-semibold text-purple-600 print:text-gray-900">
                    {" "}
                    (10, 12, and 24 colour pencils)
                  </span>
                )}
              </p>
            </section>

            {/* Professional Experience */}
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 pb-1 border-b-2 border-gradient-to-r from-purple-600/50 to-transparent">
                Professional Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {exp.position}
                      </h3>
                      <span className="text-sm font-medium text-gray-700">
                        {exp.company} — {exp.location || "Mumbai"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 italic">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="ml-5 space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 list-disc marker:text-purple-600 print:marker:text-gray-900"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Key Projects & Achievements */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 pb-1 border-b-2 border-gradient-to-r from-purple-600/50 to-transparent">
                  Key Projects & Achievements
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-3 pl-2">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Core Competencies */}
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 pb-1 border-b-2 border-gradient-to-r from-purple-600/50 to-transparent">
                Core Competencies
              </h2>

              {resumeData.skillsConfig?.enableCategories &&
              resumeData.skillsConfig?.categories ? (
                // Categorized Display
                <div className="grid grid-cols-2 gap-4">
                  {resumeData.skillsConfig.categories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-600/5 to-pink-500/5 p-3 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent print:text-gray-800 mb-2">
                        {category.name}
                      </h4>
                      <ul className="ml-4 space-y-0.5">
                        {category.skills?.map((skill, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-700 list-disc marker:text-purple-600 print:marker:text-gray-900"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                // Simple List Display
                <div className="flex flex-wrap gap-2">
                  {(
                    resumeData.skills ||
                    resumeData.skillsConfig?.categories?.flatMap(
                      (cat) => cat.skills || []
                    ) ||
                    []
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-br from-purple-600/10 to-pink-500/10 border border-purple-200/50 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Education - Two Column Layout */}
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 pb-1 border-b-2 border-gradient-to-r from-purple-600/50 to-transparent">
                Education
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-600/5 to-pink-500/5 p-3 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                      {edu.degree}
                    </h4>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {edu.institution}
                      <br />
                      {edu.location}
                    </div>
                    {edu.year && (
                      <div className="text-xs text-gray-500 italic mt-1">
                        {edu.year}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Info */}
            <section>
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-500/10 p-4 rounded-lg border border-purple-600/20">
                <div className="text-xs text-gray-700 space-y-1">
                  {resumeData.additionalInfo?.languages &&
                    resumeData.additionalInfo.languages.length > 0 && (
                      <div>
                        <span className="font-semibold text-purple-600 print:text-gray-900">
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
                      <div>
                        <span className="font-semibold text-purple-600 print:text-gray-900">
                          Interests:
                        </span>{" "}
                        {resumeData.additionalInfo.interests.join(" • ")}
                      </div>
                    )}

                  {(resumeData.contact.website ||
                    resumeData.contact.social?.behance ||
                    resumeData.contact.social?.behance2) && (
                    <div>
                      <span className="font-semibold text-purple-600 print:text-gray-900">
                        Online Presence:
                      </span>{" "}
                      {resumeData.contact.website && (
                        <span>{resumeData.contact.website}</span>
                      )}
                      {resumeData.contact.social?.behance && (
                        <span> • behance.net/aparnamunagekar</span>
                      )}
                      {resumeData.contact.social?.behance2 && (
                        <span> • behance.net/aparnamunagekar1</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
              sans-serif;
          }
        }
      `}</style>
    </>
  );
}
