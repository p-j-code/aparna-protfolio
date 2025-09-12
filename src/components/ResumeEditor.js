"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeEditor({ initialData, password, onDataUpdate }) {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle direct edits
  const handleChange = (path, value) => {
    const newData = JSON.parse(JSON.stringify(resumeData));
    let current = newData;
    const pathParts = path.split(".");

    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (part.includes("[") && part.includes("]")) {
        const arrayName = part.split("[")[0];
        const index = parseInt(part.split("[")[1].split("]")[0]);
        current = current[arrayName][index];
      } else {
        current = current[part];
      }
    }

    const finalKey = pathParts[pathParts.length - 1];
    if (finalKey.includes("[") && finalKey.includes("]")) {
      const arrayName = finalKey.split("[")[0];
      const index = parseInt(finalKey.split("[")[1].split("]")[0]);
      current[arrayName][index] = value;
    } else {
      current[finalKey] = value;
    }

    setResumeData(newData);
  };

  // Add new array item
  const addArrayItem = (path, template) => {
    const newData = JSON.parse(JSON.stringify(resumeData));
    let current = newData;
    const pathParts = path.split(".");

    for (let i = 0; i < pathParts.length; i++) {
      current = current[pathParts[i]];
    }

    current.push(JSON.parse(JSON.stringify(template)));
    setResumeData(newData);
  };

  // Remove array item
  const removeArrayItem = (path, index) => {
    const newData = JSON.parse(JSON.stringify(resumeData));
    let current = newData;
    const pathParts = path.split(".");

    for (let i = 0; i < pathParts.length; i++) {
      current = current[pathParts[i]];
    }

    current.splice(index, 1);
    setResumeData(newData);
  };

  // Save changes
  const saveChanges = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/resume/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          data: resumeData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ text: "Resume updated successfully!", type: "success" });

        if (onDataUpdate) {
          onDataUpdate(resumeData);
        }

        setIsEditing(false);

        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        setMessage({
          text: result.message || "Failed to update resume",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Section navigation tabs
  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "additional", label: "Additional Info", icon: "📋" },
  ];

  const getAllSkills = () => {
    if (resumeData.skillsConfig?.categories) {
      return resumeData.skillsConfig.categories.flatMap(
        (cat) => cat.skills || []
      );
    }
    return resumeData.skills || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Resume Editor
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Edit your professional information
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm sm:text-base rounded-lg hover:shadow-lg transition-all"
                >
                  Edit Resume
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setResumeData(initialData);
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-gray-500 text-white text-sm sm:text-base rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm sm:text-base rounded-lg hover:shadow-lg transition-all"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-sm sm:text-base ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Mobile Section Dropdown / Desktop Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-2 mb-4 sm:mb-6">
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>
                  {sections.find((s) => s.id === activeSection)?.icon}
                </span>
                <span className="font-medium">
                  {sections.find((s) => s.id === activeSection)?.label}
                </span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-left ${
                      activeSection === section.id
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden lg:inline">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Personal Information Section */}
          {activeSection === "personal" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resumeData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    />
                  ) : (
                    <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {resumeData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Professional Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resumeData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    />
                  ) : (
                    <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {resumeData.title}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Professional Summary
                </label>
                {isEditing ? (
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  />
                ) : (
                  <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                    {resumeData.summary}
                  </p>
                )}
              </div>

              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={resumeData.contact.email}
                        onChange={(e) =>
                          handleChange("contact.email", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base break-all">
                        {resumeData.contact.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={resumeData.contact.phone}
                        onChange={(e) =>
                          handleChange("contact.phone", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {resumeData.contact.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Portfolio Website
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={resumeData.contact.website}
                        onChange={(e) =>
                          handleChange("contact.website", e.target.value)
                        }
                        placeholder="aparna-portfolio.vercel.app"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base break-all">
                        {resumeData.contact.website}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={resumeData.contact.location}
                        onChange={(e) =>
                          handleChange("contact.location", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {resumeData.contact.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                  Social Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      LinkedIn URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={resumeData.contact.social?.linkedin || ""}
                        onChange={(e) =>
                          handleChange(
                            "contact.social.linkedin",
                            e.target.value
                          )
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base break-all">
                        {resumeData.contact.social?.linkedin || "Not set"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Behance URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={resumeData.contact.social?.behance || ""}
                        onChange={(e) =>
                          handleChange("contact.social.behance", e.target.value)
                        }
                        placeholder="https://behance.net/username"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base break-all">
                        {resumeData.contact.social?.behance || "Not set"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Behance URL 2 (Optional)
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={resumeData.contact.social?.behance2 || ""}
                        onChange={(e) =>
                          handleChange(
                            "contact.social.behance2",
                            e.target.value
                          )
                        }
                        placeholder="https://behance.net/username2"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-sm sm:text-base break-all">
                        {resumeData.contact.social?.behance2 || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Professional Experience
              </h2>

              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = { ...exp, company: e.target.value };
                            handleChange(`experience[${index}]`, newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {exp.company}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = { ...exp, position: e.target.value };
                            handleChange(`experience[${index}]`, newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {exp.position}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = { ...exp, duration: e.target.value };
                          handleChange(`experience[${index}]`, newExp);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {exp.duration}
                      </p>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = {
                            ...exp,
                            description: e.target.value,
                          };
                          handleChange(`experience[${index}]`, newExp);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {exp.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...exp.achievements];
                                newAchievements[achIndex] = e.target.value;
                                const newExp = {
                                  ...exp,
                                  achievements: newAchievements,
                                };
                                handleChange(`experience[${index}]`, newExp);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                            />
                            <button
                              onClick={() => {
                                const newAchievements = exp.achievements.filter(
                                  (_, i) => i !== achIndex
                                );
                                const newExp = {
                                  ...exp,
                                  achievements: newAchievements,
                                };
                                handleChange(`experience[${index}]`, newExp);
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newExp = {
                              ...exp,
                              achievements: [...exp.achievements, ""],
                            };
                            handleChange(`experience[${index}]`, newExp);
                          }}
                          className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                        >
                          + Add Achievement
                        </button>
                      </div>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="text-gray-700 text-sm sm:text-base"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={() => removeArrayItem("experience", index)}
                        className="w-full sm:w-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Remove This Experience
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={() =>
                    addArrayItem("experience", {
                      company: "",
                      position: "",
                      duration: "",
                      description: "",
                      achievements: [""],
                    })
                  }
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  + Add New Experience
                </button>
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Key Projects & Achievements
              </h2>

              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            name: e.target.value,
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg font-medium text-sm sm:text-base">
                        {project.name}
                      </p>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            description: e.target.value,
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => removeArrayItem("projects", index)}
                      className="w-full sm:w-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Remove Project
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={() =>
                    addArrayItem("projects", {
                      name: "",
                      description: "",
                    })
                  }
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  + Add New Project
                </button>
              )}
            </div>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Core Competencies
              </h2>

              {/* Category Toggle */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Use Skill Categories
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Organize skills into categories
                    </p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newConfig = {
                          ...resumeData.skillsConfig,
                          enableCategories:
                            !resumeData.skillsConfig?.enableCategories,
                        };
                        handleChange("skillsConfig", newConfig);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        resumeData.skillsConfig?.enableCategories
                          ? "bg-purple-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          resumeData.skillsConfig?.enableCategories
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Skills Management */}
              {resumeData.skillsConfig?.enableCategories ? (
                // Categorized Skills
                <div className="space-y-4 sm:space-y-6">
                  {resumeData.skillsConfig?.categories?.map(
                    (category, catIndex) => (
                      <div
                        key={catIndex}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg"
                      >
                        <div className="mb-3 sm:mb-4">
                          {isEditing ? (
                            <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                              <input
                                type="text"
                                value={category.name}
                                onChange={(e) => {
                                  const newCategories = [
                                    ...resumeData.skillsConfig.categories,
                                  ];
                                  newCategories[catIndex].name = e.target.value;
                                  handleChange(
                                    "skillsConfig.categories",
                                    newCategories
                                  );
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium text-sm sm:text-base"
                                placeholder="Category Name"
                              />
                              {resumeData.skillsConfig.categories.length >
                                1 && (
                                <button
                                  onClick={() => {
                                    const newCategories =
                                      resumeData.skillsConfig.categories.filter(
                                        (_, i) => i !== catIndex
                                      );
                                    handleChange(
                                      "skillsConfig.categories",
                                      newCategories
                                    );
                                  }}
                                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                  Remove Category
                                </button>
                              )}
                            </div>
                          ) : (
                            <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                              {category.name}
                            </h3>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2">
                            {category.skills?.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={skill}
                                  onChange={(e) => {
                                    const newCategories = [
                                      ...resumeData.skillsConfig.categories,
                                    ];
                                    newCategories[catIndex].skills[skillIndex] =
                                      e.target.value;
                                    handleChange(
                                      "skillsConfig.categories",
                                      newCategories
                                    );
                                  }}
                                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                                />
                                <button
                                  onClick={() => {
                                    const newCategories = [
                                      ...resumeData.skillsConfig.categories,
                                    ];
                                    newCategories[catIndex].skills =
                                      category.skills.filter(
                                        (_, i) => i !== skillIndex
                                      );
                                    handleChange(
                                      "skillsConfig.categories",
                                      newCategories
                                    );
                                  }}
                                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newCategories = [
                                  ...resumeData.skillsConfig.categories,
                                ];
                                newCategories[catIndex].skills = [
                                  ...(category.skills || []),
                                  "",
                                ];
                                handleChange(
                                  "skillsConfig.categories",
                                  newCategories
                                );
                              }}
                              className="px-3 sm:px-4 py-2 bg-white/50 hover:bg-white text-purple-700 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              + Add Skill
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {category.skills?.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 sm:px-3 py-1 bg-white border border-purple-200 text-gray-700 rounded-full text-xs sm:text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {isEditing && (
                    <button
                      onClick={() => {
                        const newCategories = [
                          ...(resumeData.skillsConfig?.categories || []),
                          { name: "New Category", skills: [] },
                        ];
                        handleChange("skillsConfig.categories", newCategories);
                      }}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                    >
                      + Add New Category
                    </button>
                  )}
                </div>
              ) : (
                // Simple Skills List (No Categories)
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    All Skills
                  </label>

                  {isEditing ? (
                    <div className="space-y-3">
                      {(resumeData.skills || getAllSkills()).map(
                        (skill, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [
                                  ...(resumeData.skills || getAllSkills()),
                                ];
                                newSkills[index] = e.target.value;
                                handleChange("skills", newSkills);
                              }}
                              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                            />
                            <button
                              onClick={() => {
                                const newSkills = (
                                  resumeData.skills || getAllSkills()
                                ).filter((_, i) => i !== index);
                                handleChange("skills", newSkills);
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                      <button
                        onClick={() => {
                          const newSkills = [
                            ...(resumeData.skills || getAllSkills()),
                            "",
                          ];
                          handleChange("skills", newSkills);
                        }}
                        className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                      >
                        + Add Skill
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(resumeData.skills || getAllSkills()).map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-purple-200 text-gray-700 rounded-full text-xs sm:text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Education
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree / Certification
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = { ...edu, degree: e.target.value };
                            handleChange(`education[${index}]`, newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg font-medium text-sm sm:text-base">
                          {edu.degree}
                        </p>
                      )}
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = {
                              ...edu,
                              institution: e.target.value,
                            };
                            handleChange(`education[${index}]`, newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {edu.institution}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => {
                              const newEdu = {
                                ...edu,
                                location: e.target.value,
                              };
                              handleChange(`education[${index}]`, newEdu);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                            {edu.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = { ...edu, year: e.target.value };
                              handleChange(`education[${index}]`, newEdu);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                            {edu.year}
                          </p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem("education", index)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-sm sm:text-base"
                      >
                        Remove Education
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <button
                  onClick={() =>
                    addArrayItem("education", {
                      degree: "",
                      institution: "",
                      location: "",
                      year: "",
                    })
                  }
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  + Add Education
                </button>
              )}
            </div>
          )}

          {/* Additional Info Section */}
          {activeSection === "additional" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Additional Information
              </h2>

              {/* Languages Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                  Languages
                </h3>

                {isEditing ? (
                  <div className="space-y-3">
                    {resumeData.additionalInfo?.languages?.map(
                      (lang, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-2"
                        >
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => {
                              const newLanguages = [
                                ...(resumeData.additionalInfo?.languages || []),
                              ];
                              newLanguages[index] = {
                                ...lang,
                                name: e.target.value,
                              };
                              handleChange(
                                "additionalInfo.languages",
                                newLanguages
                              );
                            }}
                            placeholder="Language"
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                          <select
                            value={lang.level}
                            onChange={(e) => {
                              const newLanguages = [
                                ...(resumeData.additionalInfo?.languages || []),
                              ];
                              newLanguages[index] = {
                                ...lang,
                                level: e.target.value,
                              };
                              handleChange(
                                "additionalInfo.languages",
                                newLanguages
                              );
                            }}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Conversational">
                              Conversational
                            </option>
                            <option value="Basic">Basic</option>
                          </select>
                          <button
                            onClick={() => {
                              const newLanguages =
                                resumeData.additionalInfo?.languages?.filter(
                                  (_, i) => i !== index
                                );
                              handleChange(
                                "additionalInfo.languages",
                                newLanguages
                              );
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      onClick={() => {
                        const newLanguages = [
                          ...(resumeData.additionalInfo?.languages || []),
                          { name: "", level: "Fluent" },
                        ];
                        handleChange("additionalInfo.languages", newLanguages);
                      }}
                      className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                    >
                      + Add Language
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {resumeData.additionalInfo?.languages?.map(
                      (lang, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-white border border-purple-200 text-gray-700 rounded-full text-xs sm:text-sm"
                        >
                          {lang.name} ({lang.level})
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Interests Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                  Interests
                </h3>

                {isEditing ? (
                  <div className="space-y-3">
                    {resumeData.additionalInfo?.interests?.map(
                      (interest, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={interest}
                            onChange={(e) => {
                              const newInterests = [
                                ...(resumeData.additionalInfo?.interests || []),
                              ];
                              newInterests[index] = e.target.value;
                              handleChange(
                                "additionalInfo.interests",
                                newInterests
                              );
                            }}
                            placeholder="Interest"
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                          <button
                            onClick={() => {
                              const newInterests =
                                resumeData.additionalInfo?.interests?.filter(
                                  (_, i) => i !== index
                                );
                              handleChange(
                                "additionalInfo.interests",
                                newInterests
                              );
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      onClick={() => {
                        const newInterests = [
                          ...(resumeData.additionalInfo?.interests || []),
                          "",
                        ];
                        handleChange("additionalInfo.interests", newInterests);
                      }}
                      className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                    >
                      + Add Interest
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {resumeData.additionalInfo?.interests?.map(
                      (interest, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-white border border-purple-200 text-gray-700 rounded-full text-xs sm:text-sm"
                        >
                          {interest}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800">
                  💡 <span className="font-medium">Note:</span> The &quot;Online
                  Presence&quot; information is automatically generated from
                  your Portfolio Website and Social Links in the Personal Info
                  section.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
