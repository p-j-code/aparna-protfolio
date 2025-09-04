"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ImageOff,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  Grid,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/portfolio-data";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProject]);

  const handleImageError = (projectId, imageIndex = 0) => {
    setImageErrors((prev) => ({
      ...prev,
      [`${projectId}-${imageIndex}`]: true,
    }));
  };

  const isImageError = (projectId, imageIndex = 0) => {
    return imageErrors[`${projectId}-${imageIndex}`];
  };

  // Get valid images count for a project
  const getValidImagesCount = (project) => {
    if (!project?.images || project.images.length === 0) return 0;
    return project.images.filter((_, idx) => !isImageError(project.id, idx))
      .length;
  };

  // Check if project has any displayable images
  const hasDisplayableImages = (project) => {
    return (
      project?.images &&
      project.images.length > 0 &&
      getValidImagesCount(project) > 0
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") navigatePrev();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "Escape") setSelectedProject(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, currentImageIndex]);

  const navigateNext = () => {
    if (!selectedProject?.images || selectedProject.images.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === selectedProject.images.length - 1 ? 0 : prev + 1
    );
  };

  const navigatePrev = () => {
    if (!selectedProject?.images || selectedProject.images.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    );
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (!selectedProject?.images || selectedProject.images.length <= 1) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) navigateNext();
    if (isRightSwipe) navigatePrev();
  };

  // Animated gradient background for missing images
  const MissingImageDisplay = ({
    project,
    index,
    showNoImagesMessage = false,
  }) => {
    const icons = [Sparkles, Layers, Palette, Grid, ImageIcon];
    const Icon = icons[index % icons.length];

    // More vibrant default colors if project color isn't defined
    const defaultGradient = "from-indigo-600 via-purple-600 to-pink-500";

    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          project.color || defaultGradient
        } overflow-hidden`}
      >
        {/* Enhanced animated gradient orbs with more vibrant colors */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Enhanced Content with glow effects and improved contrast */}
        <div className="relative h-full flex flex-col items-center justify-center text-white">
          {/* Improved icon container with glow effect */}
          <div className="bg-white/30 backdrop-blur-sm rounded-full p-6 mb-4 animate-bounce shadow-lg shadow-white/20 ring-4 ring-white/10">
            <div className="relative">
              {/* Creating a glow effect with pseudo-element */}
              <div className="absolute inset-0 blur-md bg-white opacity-50 scale-110 rounded-full"></div>
              <Icon
                className="w-12 h-12 relative z-10 text-white filter brightness-125"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                }}
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {project.title}
          </h3>
          <p className="text-white font-medium">{project.category}</p>
          {!showNoImagesMessage && (
            <div className="mt-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/20">
              <p className="text-sm text-white">Image {index + 1}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      id="projects"
      className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-50/50"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
          Featured Work
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Display - Card Preview with Error Handling */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  {project.images &&
                  project.images.length > 0 &&
                  project.images[0] &&
                  !isImageError(project.id, 0) ? (
                    <>
                      {/* Gradient background for transparent images */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          project.color || "from-purple-400/20 to-pink-400/20"
                        }`}
                      />
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() => handleImageError(project.id, 0)}
                      />
                    </>
                  ) : (
                    <MissingImageDisplay
                      project={project}
                      index={0}
                      showNoImagesMessage={
                        !project.images || project.images.length === 0
                      }
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                  {/* Image count indicator for multiple images */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs z-30 flex items-center gap-1">
                      <Grid className="w-3 h-3" />
                      {project.images.length}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-purple-600">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {project.stats}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    View Details{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Enhanced Project Modal with Image Slider */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold text-white bg-gradient-to-r ${selectedProject.color} px-3 py-1 rounded-full`}
                >
                  {selectedProject.category}
                </span>
                <span className="text-sm text-gray-500 font-medium hidden sm:inline">
                  {selectedProject.stats}
                </span>
                {/* Show total images count if any exist */}
                {selectedProject.images &&
                  selectedProject.images.length > 0 && (
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      • {selectedProject.images.length} image
                      {selectedProject.images.length !== 1 ? "s" : ""}
                    </span>
                  )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Slider Section - Show even if no images */}
            <div className="relative">
              {/* Main Image Display */}
              <div
                className="relative w-full overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
                  {/* Beautiful gradient background */}
                  <div className="absolute inset-0">
                    {/* Animated gradient mesh background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        selectedProject.color ||
                        "from-purple-400/30 via-pink-400/30 to-blue-400/30"
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
                      </div>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30" />
                  </div>

                  {/* Handle different image scenarios */}
                  {!selectedProject.images ||
                  selectedProject.images.length === 0 ? (
                    /* No images at all */
                    <MissingImageDisplay
                      project={selectedProject}
                      index={0}
                      showNoImagesMessage={true}
                    />
                  ) : !isImageError(selectedProject.id, currentImageIndex) &&
                    selectedProject.images[currentImageIndex] ? (
                    /* Image exists and hasn't errored */
                    <Image
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - Image ${
                        currentImageIndex + 1
                      }`}
                      fill
                      className="object-contain relative z-10"
                      onError={() =>
                        handleImageError(selectedProject.id, currentImageIndex)
                      }
                      priority
                    />
                  ) : (
                    /* Current image has error or is missing */
                    <MissingImageDisplay
                      project={selectedProject}
                      index={currentImageIndex}
                      showNoImagesMessage={false}
                    />
                  )}

                  {/* Navigation Arrows - Only show if multiple images exist */}
                  {selectedProject.images &&
                    selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={navigatePrev}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 transition-all z-20"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={navigateNext}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 transition-all z-20"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </>
                    )}
                </div>

                {/* Image Counter - Show if multiple images */}
                {selectedProject.images &&
                  selectedProject.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                      {getValidImagesCount(selectedProject) <
                        selectedProject.images.length && (
                        <span className="ml-1 text-yellow-300 text-xs">
                          ({getValidImagesCount(selectedProject)} available)
                        </span>
                      )}
                    </div>
                  )}
              </div>

              {/* Thumbnail Preview Strip - Only show if multiple images */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="px-4 py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
                  <div className="flex gap-3 overflow-x-auto pb-2 px-2">
                    {selectedProject.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-shrink-0 transition-all ${
                          idx === currentImageIndex
                            ? "scale-110"
                            : "scale-100 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <div
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ${
                            idx === currentImageIndex
                              ? "ring-2 ring-purple-500 ring-offset-2"
                              : ""
                          }`}
                        >
                          {img && !isImageError(selectedProject.id, idx) ? (
                            <>
                              {/* Gradient background for thumbnails */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${
                                  selectedProject.color ||
                                  "from-purple-400/20 to-pink-400/20"
                                }`}
                              />
                              <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover relative z-10"
                                onError={() =>
                                  handleImageError(selectedProject.id, idx)
                                }
                              />
                            </>
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${
                                selectedProject.color ||
                                "from-indigo-600 via-purple-600 to-pink-500"
                              } flex items-center justify-center shadow-inner shadow-white/30`}
                            >
                              <div className="relative">
                                <div className="absolute inset-0 blur-md bg-white opacity-50 scale-110 rounded-full"></div>
                                <Sparkles
                                  className="w-6 h-6 text-white relative z-10 filter brightness-125"
                                  style={{
                                    filter:
                                      "drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {idx === currentImageIndex && (
                            <div className="absolute inset-0 bg-purple-500/10 z-20" />
                          )}
                          {/* Error indicator on thumbnail */}
                          {isImageError(selectedProject.id, idx) && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full z-30" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Info about broken images if any */}
                  {getValidImagesCount(selectedProject) <
                    selectedProject.images.length && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Some images may not be available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                {selectedProject.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                {selectedProject.longDescription || selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-200 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
