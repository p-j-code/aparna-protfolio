"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsEditor({
  initialData,
  password,
  onDataUpdate,
}) {
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");

  // Handle direct edits
  const handleChange = (path, value) => {
    const newData = JSON.parse(JSON.stringify(portfolioData));
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

    setPortfolioData(newData);
  };

  // Add new array item
  const addArrayItem = (path, template) => {
    const newData = JSON.parse(JSON.stringify(portfolioData));
    let current = newData;
    const pathParts = path.split(".");

    for (let i = 0; i < pathParts.length; i++) {
      current = current[pathParts[i]];
    }

    current.push(JSON.parse(JSON.stringify(template)));
    setPortfolioData(newData);
  };

  // Remove array item
  const removeArrayItem = (path, index) => {
    const newData = JSON.parse(JSON.stringify(portfolioData));
    let current = newData;
    const pathParts = path.split(".");

    for (let i = 0; i < pathParts.length; i++) {
      current = current[pathParts[i]];
    }

    current.splice(index, 1);
    setPortfolioData(newData);
  };

  // Save changes
  const saveChanges = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/portfolio/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          data: portfolioData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          text: "Portfolio updated successfully!",
          type: "success",
        });

        if (onDataUpdate) {
          onDataUpdate(portfolioData);
        }

        setIsEditing(false);

        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        setMessage({
          text: result.message || "Failed to update portfolio",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Projects Editor
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Edit your portfolio projects
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm sm:text-base rounded-lg hover:shadow-lg transition-all"
                >
                  Edit Projects
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setPortfolioData(initialData);
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

        {/* Content Area */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Projects Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Portfolio Projects
            </h2>

            {portfolioData.projects.map((project, index) => (
              <div
                key={project.id || index}
                className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            title: e.target.value,
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg font-medium text-sm sm:text-base">
                        {project.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.category}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            category: e.target.value,
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {project.category}
                      </p>
                    )}
                  </div>
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

                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={project.longDescription || ""}
                      onChange={(e) => {
                        const newProject = {
                          ...project,
                          longDescription: e.target.value,
                        };
                        handleChange(`projects[${index}]`, newProject);
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {project.longDescription || "Not set"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stats
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.stats}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            stats: e.target.value,
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {project.stats}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Featured
                    </label>
                    {isEditing ? (
                      <select
                        value={project.featured ? "true" : "false"}
                        onChange={(e) => {
                          const newProject = {
                            ...project,
                            featured: e.target.value === "true",
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {project.featured ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {project.tags.map((tag, tagIndex) => (
                        <div key={tagIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => {
                              const newTags = [...project.tags];
                              newTags[tagIndex] = e.target.value;
                              const newProject = { ...project, tags: newTags };
                              handleChange(`projects[${index}]`, newProject);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                          <button
                            onClick={() => {
                              const newTags = project.tags.filter(
                                (_, i) => i !== tagIndex
                              );
                              const newProject = { ...project, tags: newTags };
                              handleChange(`projects[${index}]`, newProject);
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newProject = {
                            ...project,
                            tags: [...project.tags, ""],
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                      >
                        + Add Tag
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images (URLs)
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {project.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...project.images];
                              newImages[imageIndex] = e.target.value;
                              const newProject = {
                                ...project,
                                images: newImages,
                              };
                              handleChange(`projects[${index}]`, newProject);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                            placeholder="/projects/project-name/image.jpg"
                          />
                          <button
                            onClick={() => {
                              const newImages = project.images.filter(
                                (_, i) => i !== imageIndex
                              );
                              const newProject = {
                                ...project,
                                images: newImages,
                              };
                              handleChange(`projects[${index}]`, newProject);
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newProject = {
                            ...project,
                            images: [...project.images, ""],
                          };
                          handleChange(`projects[${index}]`, newProject);
                        }}
                        className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                      >
                        + Add Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {project.images.map((image, imageIndex) => (
                        <p
                          key={imageIndex}
                          className="px-3 py-2 bg-gray-50 rounded-lg text-sm break-all"
                        >
                          {image}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Gradient
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={project.color || ""}
                      onChange={(e) => {
                        const newProject = {
                          ...project,
                          color: e.target.value,
                        };
                        handleChange(`projects[${index}]`, newProject);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="from-purple-500 to-pink-500"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {project.color || "Default"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeArrayItem("projects", index)}
                      className="w-full sm:w-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Remove This Project
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                onClick={() =>
                  addArrayItem("projects", {
                    id: Date.now(),
                    title: "",
                    category: "",
                    description: "",
                    longDescription: "",
                    tags: [],
                    stats: "",
                    featured: false,
                    images: [],
                    color: "",
                  })
                }
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
              >
                + Add New Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
