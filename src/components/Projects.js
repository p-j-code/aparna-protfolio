"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  Grid,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Share2,
  Heart,
  Eye,
  Clock,
  Search,
  Maximize2,
  Play,
  Pause,
  Info,
  ExternalLink,
  Tag,
  Calendar,
  User,
  Shuffle,
  Circle,
  Layout,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/portfolio-data";

// ============================================================================
// LAYOUT & MODE CONFIGURATIONS
// ============================================================================

const LAYOUTS = {
  BENTO: "bento",
  SCATTERED: "scattered",
  ORBITAL: "orbital",
};

const layoutConfig = {
  [LAYOUTS.BENTO]: { icon: Grid, name: "Bento Grid" },
  [LAYOUTS.SCATTERED]: { icon: Shuffle, name: "Scattered" },
  [LAYOUTS.ORBITAL]: { icon: Circle, name: "Orbital" },
};

const DETAIL_MODES = {
  SHOWCASE: "showcase",
  CAROUSEL: "carousel",
  SCROLL: "scroll",
};

const detailModeConfig = {
  [DETAIL_MODES.SHOWCASE]: { icon: Layout, name: "Showcase" },
  [DETAIL_MODES.CAROUSEL]: { icon: Layers, name: "Carousel" },
  [DETAIL_MODES.SCROLL]: { icon: Grid, name: "Scroll" },
};

// ============================================================================
// ENHANCED DETAIL VIEW COMPONENT
// ============================================================================

const ProjectDetailView = ({
  project,
  onClose,
  likedProjects,
  toggleLike,
  imageErrors,
  handleImageError,
  allProjects,
  onNavigateProject,
  filteredProjects,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailMode, setDetailMode] = useState(DETAIL_MODES.SHOWCASE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayRef = useRef(null);

  const images = project.images || [];
  const hasMultipleImages = images.length > 1;

  // Get current project index in filtered list for navigation
  const currentProjectIndex = filteredProjects.findIndex(
    (p) => p.id === project.id
  );
  const hasPrevProject = currentProjectIndex > 0;
  const hasNextProject = currentProjectIndex < filteredProjects.length - 1;

  // Navigate to previous/next project
  const goToPrevProject = () => {
    if (hasPrevProject) {
      onNavigateProject(filteredProjects[currentProjectIndex - 1]);
      setCurrentImageIndex(0);
    }
  };

  const goToNextProject = () => {
    if (hasNextProject) {
      onNavigateProject(filteredProjects[currentProjectIndex + 1]);
      setCurrentImageIndex(0);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying && hasMultipleImages) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying, images.length, hasMultipleImages]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setZoomLevel(1);
  }, [project.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && !e.shiftKey) navigatePrev();
      if (e.key === "ArrowRight" && !e.shiftKey) navigateNext();
      // Shift + Arrow for project navigation
      if (e.key === "ArrowLeft" && e.shiftKey) goToPrevProject();
      if (e.key === "ArrowRight" && e.shiftKey) goToNextProject();
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentProjectIndex, filteredProjects]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !hasMultipleImages) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) navigateNext();
    if (distance < -50) navigatePrev();
  };

  const navigateNext = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setZoomLevel(1);
    }
  };

  const navigatePrev = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
      setZoomLevel(1);
    }
  };

  const isImageError = (index) => imageErrors[`${project.id}-${index}`];

  // Placeholder component
  const Placeholder = ({ index = 0, className = "" }) => {
    const icons = [Sparkles, Layers, Palette, Grid, ImageIcon];
    const Icon = icons[index % icons.length];
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          project.color || "from-amber-500 via-rose-500 to-violet-600"
        } overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-3">
            <Icon className="w-8 h-8" />
          </div>
          <span className="text-lg font-bold">{project.title}</span>
        </div>
      </div>
    );
  };

  // Image display component
  const ImageDisplay = ({
    index,
    className = "",
    style = {},
    objectFit = "contain",
  }) => {
    const imgSrc = images[index];
    if (!imgSrc || isImageError(index)) {
      return <Placeholder index={index} className={className} />;
    }
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={imgSrc}
          alt={`${project.title} - ${index + 1}`}
          fill
          className={`object-${objectFit}`}
          style={style}
          onError={() => handleImageError(project.id, index)}
          priority
        />
      </div>
    );
  };

  // Content Panel Component (reused across modes)
  const ContentPanel = ({ className = "", isMobile = false }) => (
    <div
      className={`bg-white ${
        isMobile ? "p-5" : "p-6 md:p-8"
      } overflow-y-auto ${className}`}
    >
      <div className="space-y-5">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
            project.color || "from-purple-500 to-pink-500"
          }`}
        >
          {project.category}
        </span>

        <h1
          className={`${
            isMobile ? "text-2xl" : "text-3xl md:text-4xl"
          } font-black text-gray-900 leading-tight`}
        >
          {project.title}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {project.longDescription || project.description}
        </p>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-200">
          {project.year && (
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Year
              </span>
              <p className="font-semibold text-gray-800">{project.year}</p>
            </div>
          )}
          {project.duration && (
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Duration
              </span>
              <p className="font-semibold text-gray-800">{project.duration}</p>
            </div>
          )}
          {project.client && (
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3" /> Client
              </span>
              <p className="font-semibold text-gray-800">{project.client}</p>
            </div>
          )}
          {project.stats && (
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3" /> Stats
              </span>
              <p className="font-semibold text-gray-800">{project.stats}</p>
            </div>
          )}
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Images
            </span>
            <p className="font-semibold text-gray-800">{images.length}</p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-3">
            <Tag className="w-3 h-3" /> Technologies
          </span>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-stone-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(project.id);
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              likedProjects.has(project.id)
                ? "bg-rose-500 text-white"
                : "bg-stone-100 text-gray-700 hover:bg-stone-200"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                likedProjects.has(project.id) ? "fill-current" : ""
              }`}
            />
            {likedProjects.has(project.id) ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Live
          </button>
        </div>

        {/* Project Navigation */}
        <div className="pt-4 border-t border-stone-200">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
            Browse Projects ({currentProjectIndex + 1} of{" "}
            {filteredProjects.length})
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevProject();
              }}
              disabled={!hasPrevProject}
              className={`flex-1 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                hasPrevProject
                  ? "bg-stone-100 text-gray-700 hover:bg-stone-200"
                  : "bg-stone-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNextProject();
              }}
              disabled={!hasNextProject}
              className={`flex-1 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                hasNextProject
                  ? "bg-stone-100 text-gray-700 hover:bg-stone-200"
                  : "bg-stone-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // SHOWCASE MODE (Combined Theater + Split)
  // ============================================================================
  const ShowcaseMode = () => (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-stone-900">
      {/* Left side - Image + Thumbnails */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Main Image */}
        <div
          className="flex-1 relative flex items-center justify-center p-4 md:p-8 min-h-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient glow */}
          <div
            className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
              project.color || "from-purple-500 to-pink-500"
            } blur-3xl`}
          />

          {/* Image container */}
          <div
            className="relative w-full h-full max-h-[50vh] md:max-h-full transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <ImageDisplay
              index={currentImageIndex}
              className="rounded-lg"
              objectFit="contain"
            />
          </div>

          {/* Navigation arrows for images */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigatePrev();
                }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full transition-all hover:scale-110 text-white"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateNext();
                }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full transition-all hover:scale-110 text-white"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails strip */}
        {hasMultipleImages && (
          <div className="bg-black/40 backdrop-blur-md p-3 md:p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2 md:gap-3 justify-start md:justify-center overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all ${
                    idx === currentImageIndex
                      ? "ring-2 ring-white scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {img && !isImageError(idx) ? (
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      onError={() => handleImageError(project.id, idx)}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        project.color || "from-purple-500 to-pink-500"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side - Content Panel (hidden on mobile, shown as bottom sheet) */}
      <div className="hidden md:block w-[400px] lg:w-[450px] border-l border-white/10 overflow-y-auto">
        <ContentPanel />
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden max-h-[45vh] overflow-y-auto border-t border-white/10">
        <ContentPanel isMobile />
      </div>
    </div>
  );

  // ============================================================================
  // CAROUSEL MODE (Fixed 3D Carousel with smooth transitions)
  // ============================================================================
  // ============================================================================
  // CAROUSEL MODE (Fixed 3D Carousel with smooth transitions)
  // ============================================================================
  // ============================================================================
  // CAROUSEL MODE (Fixed 3D Carousel with smooth transitions)
  // ============================================================================
  // ============================================================================
  // CAROUSEL MODE (Fixed 3D Carousel with smooth transitions)
  // ============================================================================
  const CarouselMode = () => {
    const [activeIndex, setActiveIndex] = useState(currentImageIndex);
    const [isDragging, setIsDragging] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showMobileInfo, setShowMobileInfo] = useState(false);
    const dragStartTime = useRef(0);

    // Sync with parent state
    useEffect(() => {
      setActiveIndex(currentImageIndex);
    }, [currentImageIndex]);

    const handleMouseDown = (e) => {
      if (isAnimating) return;
      setIsDragging(true);
      setHasDragged(false);
      dragStartTime.current = Date.now();
      setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
      setDragOffset(0);
    };

    const handleMouseMove = (e) => {
      if (!isDragging || isAnimating) return;
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
      const diff = currentX - startX;
      if (Math.abs(diff) > 5) {
        setHasDragged(true);
      }
      setDragOffset(diff);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      const dragDuration = Date.now() - dragStartTime.current;
      const wasDragging =
        hasDragged || Math.abs(dragOffset) > 10 || dragDuration > 150;

      if (Math.abs(dragOffset) > 80) {
        if (dragOffset < 0) {
          goToImage((activeIndex + 1) % images.length);
        } else {
          goToImage((activeIndex - 1 + images.length) % images.length);
        }
      }

      setIsDragging(false);
      setDragOffset(0);

      if (wasDragging) {
        setTimeout(() => setHasDragged(false), 200);
      } else {
        setHasDragged(false);
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) return;
      setIsDragging(false);
      setDragOffset(0);
      setTimeout(() => setHasDragged(false), 200);
    };

    const goToImage = (idx) => {
      if (isAnimating || idx === activeIndex) return;
      setIsAnimating(true);
      setActiveIndex(idx);
      setCurrentImageIndex(idx);
      setTimeout(() => setIsAnimating(false), 600);
    };

    const handleCardClick = (idx, e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged && !isDragging) {
        goToImage(idx);
      }
    };

    const handleMobileInfoToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged && !isDragging) {
        setShowMobileInfo(!showMobileInfo);
      }
    };

    const handleDesktopInfoToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged && !isDragging) {
        setShowInfo(!showInfo);
      }
    };

    const getCardStyle = (idx) => {
      const totalCards = images.length;
      let diff = idx - activeIndex;

      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;

      const dragInfluence = isDragging ? dragOffset / 300 : 0;
      const adjustedDiff = diff + dragInfluence;

      const absPos = Math.abs(adjustedDiff);
      const isCenter = absPos < 0.5;

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const spacing = isMobile ? 140 : 260;

      const translateX = adjustedDiff * spacing;
      const translateZ = isCenter ? 80 : -absPos * 80;
      const rotateY = adjustedDiff * -20;
      const scale = isCenter ? 1.05 : Math.max(0.75, 1 - absPos * 0.15);
      const opacity = Math.max(0.4, 1 - absPos * 0.25);

      return {
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: 10 - Math.floor(absPos),
        transition: isDragging
          ? "none"
          : "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
      };
    };

    return (
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex flex-col overflow-hidden">
        {/* 3D Carousel Area */}
        <div
          className={`relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-500 ease-in-out flex-1 min-h-0`}
          style={{ perspective: "1200px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Spotlight effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 via-transparent to-transparent rounded-full pointer-events-none" />

          {/* Cards container */}
          <div
            className="relative w-full h-full flex items-center justify-center px-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            {images.map((img, idx) => {
              const style = getCardStyle(idx);
              const isActive = idx === activeIndex;

              return (
                <div
                  key={idx}
                  className={`absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer select-none transition-all duration-500 ${
                    isActive
                      ? "ring-4 ring-white/60"
                      : "hover:ring-2 hover:ring-white/30"
                  }`}
                  style={{
                    ...style,
                    // Use max dimensions and let image determine actual size
                    width: "auto",
                    height: "auto",
                    maxWidth: showMobileInfo ? "65vw" : "80vw",
                    maxHeight: showMobileInfo ? "50vh" : "70vh",
                  }}
                  onClick={(e) => handleCardClick(idx, e)}
                >
                  {img && !isImageError(idx) ? (
                    <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden">
                      <img
                        src={img}
                        alt={`${project.title} - ${idx + 1}`}
                        className="block max-w-full max-h-[70vh] w-auto h-auto object-contain pointer-events-none"
                        style={{
                          maxHeight: showMobileInfo ? "50vh" : "70vh",
                          maxWidth: showMobileInfo ? "65vw" : "80vw",
                        }}
                        onError={() => handleImageError(project.id, idx)}
                        draggable={false}
                      />
                      {/* Image number badge */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-medium pointer-events-none">
                        {idx + 1}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center"
                      style={{
                        width: showMobileInfo ? "65vw" : "80vw",
                        height: showMobileInfo ? "50vh" : "70vh",
                        maxWidth: "400px",
                        maxHeight: "500px",
                      }}
                    >
                      <Placeholder index={idx} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasDragged)
                goToImage((activeIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur p-2.5 md:p-4 rounded-full text-white z-20 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasDragged) goToImage((activeIndex + 1) % images.length);
            }}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur p-2.5 md:p-4 rounded-full text-white z-20 transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-sm z-20">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 py-2 md:py-3 flex-shrink-0">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!hasDragged) goToImage(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === activeIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Mobile Info Toggle Button */}
        <div className="md:hidden flex justify-center py-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleMobileInfoToggle}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium transition-all active:scale-95"
          >
            <Info className="w-4 h-4" />
            {showMobileInfo ? "Hide Info" : "Show Info"}
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                showMobileInfo ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
        </div>

        {/* Mobile Info Panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out flex-shrink-0 ${
            showMobileInfo ? "max-h-[40vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="overflow-y-auto max-h-[40vh] bg-black/60 backdrop-blur-md border-t border-white/10">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                    project.color || "from-purple-500 to-pink-500"
                  }`}
                >
                  {project.category}
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(project.id);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    likedProjects.has(project.id)
                      ? "bg-rose-500 text-white"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedProjects.has(project.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
              <h2 className="text-lg font-bold text-white">{project.title}</h2>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                {project.longDescription || project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/10 text-white/80 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project navigation */}
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevProject();
                  }}
                  disabled={!hasPrevProject}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    hasPrevProject
                      ? "bg-white/10 text-white active:scale-95"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Prev
                </button>
                <span className="flex items-center text-white/50 text-xs px-2">
                  {currentProjectIndex + 1}/{filteredProjects.length}
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNextProject();
                  }}
                  disabled={!hasNextProject}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    hasNextProject
                      ? "bg-white/10 text-white active:scale-95"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom info bar with toggle */}
        <div className="hidden md:flex flex-col flex-shrink-0">
          {/* Toggle button */}
          <div className="flex justify-center py-2 bg-black/30">
            <button
              type="button"
              onClick={handleDesktopInfoToggle}
              className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all"
            >
              <Info className="w-4 h-4" />
              {showInfo ? "Hide Info" : "Show Info"}
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  showInfo ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>
          </div>

          {/* Info content */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out bg-black/50 backdrop-blur-md border-t border-white/10 ${
              showInfo
                ? "max-h-[200px] opacity-100"
                : "max-h-0 opacity-0 border-t-0"
            }`}
          >
            <div className="px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start justify-between gap-6">
                  {/* Left side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                          project.color || "from-purple-500 to-pink-500"
                        }`}
                      >
                        {project.category}
                      </span>
                      <h2 className="text-xl font-bold text-white truncate">
                        {project.title}
                      </h2>
                    </div>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 6).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(project.id);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                          likedProjects.has(project.id)
                            ? "bg-rose-500 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedProjects.has(project.id) ? "fill-current" : ""
                          }`}
                        />
                        {likedProjects.has(project.id) ? "Liked" : "Like"}
                      </button>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goToPrevProject();
                        }}
                        disabled={!hasPrevProject}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          hasPrevProject
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-white/5 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Prev
                      </button>
                      <span className="text-white/50 text-sm px-2">
                        {currentProjectIndex + 1} / {filteredProjects.length}
                      </span>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goToNextProject();
                        }}
                        disabled={!hasNextProject}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          hasNextProject
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-white/5 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        Next
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ============================================================================
  // SCROLL MODE (Fixed - No auto-scroll behavior)
  // ============================================================================
  const ScrollMode = () => {
    return (
      <div className="absolute inset-0 bg-stone-100 overflow-hidden flex flex-col md:flex-row">
        {/* Scrolling images area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-8 space-y-6 md:space-y-10">
            {/* Project header on mobile */}
            <div className="md:hidden mb-6">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                  project.color || "from-purple-500 to-pink-500"
                } mb-3`}
              >
                {project.category}
              </span>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                {project.title}
              </h1>
              <p className="text-gray-600 text-sm">{project.description}</p>
            </div>

            {/* Large scrolling images - FIXED: Show complete images */}
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-white"
              >
                {/* Image number badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium z-10 pointer-events-none">
                  {idx + 1} / {images.length}
                </div>

                {/* Fullscreen button */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                    setDetailMode(DETAIL_MODES.SHOWCASE);
                  }}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg z-10 transition-transform hover:scale-110"
                >
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>

                {/* Image - FIXED: Use object-contain and proper aspect ratio */}
                <div className="relative w-full bg-stone-50">
                  {img && !isImageError(idx) ? (
                    <div className="relative w-full flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                      {/* Using img tag for natural sizing in scroll view */}
                      <img
                        src={img}
                        alt={`${project.title} - ${idx + 1}`}
                        className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                        onError={() => handleImageError(project.id, idx)}
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "66.67%" }}
                    >
                      <Placeholder index={idx} />
                    </div>
                  )}
                </div>

                {/* Optional caption area */}
                {idx === 0 && (
                  <div className="p-4 md:p-6 border-t border-stone-100">
                    <p className="text-gray-600 text-sm md:text-base">
                      {project.longDescription?.slice(0, 150) ||
                        project.description.slice(0, 150)}
                      ...
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom info on mobile */}
            <div className="md:hidden pt-4 pb-8">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Mobile project navigation */}
              <div className="flex gap-2">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevProject();
                  }}
                  disabled={!hasPrevProject}
                  className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    hasPrevProject
                      ? "bg-white text-gray-700 shadow-md"
                      : "bg-stone-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNextProject();
                  }}
                  disabled={!hasNextProject}
                  className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    hasNextProject
                      ? "bg-white text-gray-700 shadow-md"
                      : "bg-stone-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar on desktop */}
        <div className="hidden md:block w-[380px] lg:w-[420px] border-l border-stone-200 overflow-y-auto bg-white">
          <ContentPanel />
        </div>
      </div>
    );
  };

  const renderDetailMode = () => {
    switch (detailMode) {
      case DETAIL_MODES.SHOWCASE:
        return <ShowcaseMode />;
      case DETAIL_MODES.CAROUSEL:
        return <CarouselMode />;
      case DETAIL_MODES.SCROLL:
        return <ScrollMode />;
      default:
        return <ShowcaseMode />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black/50">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/50 to-transparent p-3 md:p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Mode selector */}
          <div className="flex gap-1 bg-white/10 backdrop-blur-md rounded-full p-1">
            {Object.entries(detailModeConfig).map(
              ([key, { icon: Icon, name }]) => (
                <button
                  key={key}
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDetailMode(key);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    detailMode === key
                      ? "bg-white text-gray-900"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{name}</span>
                </button>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Slideshow control */}
            {hasMultipleImages && detailMode !== DETAIL_MODES.SCROLL && (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPlaying((p) => !p);
                }}
                className={`p-2.5 md:p-3 rounded-full transition-all ${
                  isPlaying
                    ? "bg-white text-gray-900"
                    : "bg-white/10 text-white/80"
                }`}
                title={isPlaying ? "Pause" : "Play slideshow"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Like */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(project.id);
              }}
              className={`p-2.5 md:p-3 rounded-full transition-all ${
                likedProjects.has(project.id)
                  ? "bg-rose-500 text-white"
                  : "bg-white/10 text-white/80"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  likedProjects.has(project.id) ? "fill-current" : ""
                }`}
              />
            </button>

            {/* Share */}
            <button
              type="button"
              tabIndex={-1}
              className="p-2.5 md:p-3 bg-white/10 text-white/80 hover:text-white rounded-full"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2.5 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full ml-1 md:ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 pt-14 md:pt-16 relative overflow-hidden">
        {renderDetailMode()}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PROJECTS COMPONENT
// ============================================================================

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [likedProjects, setLikedProjects] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentLayout, setCurrentLayout] = useState(LAYOUTS.BENTO);
  const [orbitalRotation, setOrbitalRotation] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeOrbitalProject, setActiveOrbitalProject] = useState(null);

  // Orbital animation - stop when modal is open
  useEffect(() => {
    if (currentLayout === LAYOUTS.ORBITAL && !selectedProject) {
      const interval = setInterval(() => {
        setOrbitalRotation((prev) => (prev + 0.15) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentLayout, selectedProject]);

  // Clear hover states when modal opens
  useEffect(() => {
    if (selectedProject) {
      setHoveredProject(null);
      setActiveOrbitalProject(null);
    }
  }, [selectedProject]);

  const handleImageError = useCallback((projectId, imageIndex = 0) => {
    setImageErrors((prev) => ({
      ...prev,
      [`${projectId}-${imageIndex}`]: true,
    }));
  }, []);

  const isImageError = useCallback(
    (projectId, imageIndex = 0) => {
      return imageErrors[`${projectId}-${imageIndex}`];
    },
    [imageErrors]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      return matchesSearch && matchesCategory && project.featured;
    });
  }, [searchTerm, selectedCategory]);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    []
  );

  const toggleLike = useCallback((projectId, e) => {
    e?.stopPropagation();
    setLikedProjects((prev) => {
      const newSet = new Set(prev);
      newSet.has(projectId) ? newSet.delete(projectId) : newSet.add(projectId);
      return newSet;
    });
  }, []);

  // ============================================================================
  // PLACEHOLDER COMPONENT
  // ============================================================================
  const MissingImageDisplay = ({ project, index = 0, className = "" }) => {
    const icons = [Sparkles, Layers, Palette, Grid, ImageIcon];
    const Icon = icons[index % icons.length];
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          project.color || "from-amber-500 via-rose-500 to-violet-600"
        } overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-2">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-center px-4">
            {project.title}
          </span>
        </div>
      </div>
    );
  };

  // ============================================================================
  // PROJECT CARD
  // ============================================================================
  const ProjectCard = ({ project, index, style = {}, className = "" }) => {
    const isHovered = hoveredProject === project.id;
    const hasError = isImageError(project.id, 0);

    return (
      <div
        className={`group cursor-pointer relative overflow-hidden transition-all duration-500 ${className}`}
        style={style}
        onClick={() => setSelectedProject(project)}
        onMouseEnter={() => !selectedProject && setHoveredProject(project.id)}
        onMouseLeave={() => !selectedProject && setHoveredProject(null)}
      >
        <div className="relative w-full h-full">
          {project.images?.[0] && !hasError ? (
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => handleImageError(project.id, 0)}
            />
          ) : (
            <MissingImageDisplay project={project} index={0} />
          )}
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 text-white transform transition-all duration-500 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h3 className="text-lg font-bold mb-1">{project.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">
            {project.description}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/20 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.images?.length > 1 && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" /> {project.images.length}
              </span>
            )}
          </div>
        </div>

        <div
          className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => toggleLike(project.id, e)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              likedProjects.has(project.id)
                ? "bg-rose-500/80 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                likedProjects.has(project.id) ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        {project.images?.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> {project.images.length}
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // BENTO LAYOUT
  // ============================================================================
  const BentoLayout = () => {
    const patterns = [
      "col-span-2 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
    ];
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
        {filteredProjects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            className={`${
              patterns[i % patterns.length]
            } rounded-2xl shadow-lg hover:shadow-2xl hover:z-10`}
          />
        ))}
      </div>
    );
  };

  // ============================================================================
  // SCATTERED LAYOUT
  // ============================================================================
  const ScatteredLayout = () => {
    const patterns = useMemo(
      () =>
        filteredProjects.map((_, i) => ({
          rotate: Math.sin(i * 2.5) * 12 - 6,
          x: Math.sin(i * 1.3) * 15,
          y: Math.cos(i * 1.7) * 10,
        })),
      [filteredProjects.length]
    );

    return (
      <div className="relative bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 rounded-3xl p-6 md:p-8 min-h-[600px]">
        <div className="absolute inset-0 opacity-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {filteredProjects.map((p, i) => {
            const pat = patterns[i];
            const isHov = hoveredProject === p.id;
            return (
              <div
                key={p.id}
                className="cursor-pointer transition-all duration-500"
                style={{
                  transform: isHov
                    ? "rotate(0deg) scale(1.08) translateY(-20px)"
                    : `rotate(${pat.rotate}deg) translate(${pat.x}px, ${pat.y}px)`,
                  zIndex: isHov ? 50 : i,
                }}
                onClick={() => setSelectedProject(p)}
                onMouseEnter={() => !selectedProject && setHoveredProject(p.id)}
                onMouseLeave={() => !selectedProject && setHoveredProject(null)}
              >
                <div className="bg-white p-2 pb-10 shadow-xl hover:shadow-2xl transition-shadow relative rounded-sm">
                  <div className="relative aspect-square overflow-hidden">
                    {p.images?.[0] && !isImageError(p.id, 0) ? (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(p.id, 0)}
                      />
                    ) : (
                      <MissingImageDisplay project={p} index={0} />
                    )}
                  </div>
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 truncate px-2 font-medium">
                    {p.title}
                  </p>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-5 bg-amber-100/70 rotate-1 rounded-sm" />
                </div>
                {likedProjects.has(p.id) && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Heart className="w-3.5 h-3.5 text-white fill-current" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // ORBITAL LAYOUT (Improved with better click handling)
  // ============================================================================
  const OrbitalLayout = () => {
    const centerProject = filteredProjects[0];
    const orbitingProjects = filteredProjects.slice(1, 7);
    const radius = 200;

    const handleProjectClick = (project, e) => {
      e.stopPropagation();
      setSelectedProject(project);
    };

    return (
      <div className="relative h-[600px] md:h-[650px] flex items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100 rounded-3xl overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] border-2 border-dashed border-amber-200/50 rounded-full" />
        <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] border border-dashed border-rose-200/30 rounded-full" />

        {/* Center project */}
        {centerProject && (
          <div
            className="relative z-20 w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={(e) => handleProjectClick(centerProject, e)}
          >
            {centerProject.images?.[0] && !isImageError(centerProject.id, 0) ? (
              <Image
                src={centerProject.images[0]}
                alt={centerProject.title}
                fill
                className="object-cover"
                onError={() => handleImageError(centerProject.id, 0)}
              />
            ) : (
              <MissingImageDisplay project={centerProject} index={0} />
            )}
            {/* Center overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
              <span className="text-white font-bold text-sm md:text-base text-center px-2">
                {centerProject.title}
              </span>
            </div>
          </div>
        )}

        {/* Orbiting projects */}
        {orbitingProjects.map((p, i) => {
          const angle =
            ((i * (360 / orbitingProjects.length) + orbitalRotation) *
              Math.PI) /
            180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isActive = activeOrbitalProject === p.id;

          return (
            <div
              key={p.id}
              className={`absolute w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl cursor-pointer transition-all duration-300 ${
                isActive
                  ? "scale-150 z-30 ring-4 ring-white"
                  : "hover:scale-125 hover:z-20"
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: "50%",
                top: "50%",
                marginLeft: "-40px",
                marginTop: "-40px",
              }}
              onClick={(e) => handleProjectClick(p, e)}
              onMouseEnter={() =>
                !selectedProject && setActiveOrbitalProject(p.id)
              }
              onMouseLeave={() =>
                !selectedProject && setActiveOrbitalProject(null)
              }
            >
              {p.images?.[0] && !isImageError(p.id, 0) ? (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(p.id, 0)}
                />
              ) : (
                <MissingImageDisplay project={p} index={0} />
              )}

              {/* Hover tooltip */}
              {isActive && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-40">
                  {p.title}
                </div>
              )}
            </div>
          );
        })}

        {/* Center label */}
        <div className="absolute bottom-8 md:bottom-12 text-center">
          <p className="text-gray-500 text-sm">
            Click any project to view details
          </p>
        </div>

        {/* Like indicators */}
        {filteredProjects.slice(0, 7).map((p, i) => {
          if (!likedProjects.has(p.id)) return null;
          const isCenter = i === 0;
          if (isCenter) {
            return (
              <div
                key={p.id}
                className="absolute z-30"
                style={{ top: "calc(50% - 100px)", left: "calc(50% + 70px)" }}
              >
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case LAYOUTS.BENTO:
        return <BentoLayout />;
      case LAYOUTS.SCATTERED:
        return <ScatteredLayout />;
      case LAYOUTS.ORBITAL:
        return <OrbitalLayout />;
      default:
        return <BentoLayout />;
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <section
      id="projects"
      className="py-20 px-4 md:px-6 bg-gradient-to-b from-transparent via-stone-50/50 to-amber-50/30"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-violet-600 bg-clip-text text-transparent">
              Featured Work
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore projects through different creative perspectives
          </p>
        </div>

        {/* Layout Selector */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2 bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-lg">
            {Object.entries(layoutConfig).map(([key, { icon: Icon, name }]) => (
              <button
                key={key}
                onClick={() => setCurrentLayout(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  currentLayout === key
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-amber-400 shadow-lg transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Display */}
        <div className="transition-all duration-500">
          {filteredProjects.length > 0 ? (
            renderLayout()
          ) : (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          likedProjects={likedProjects}
          toggleLike={toggleLike}
          imageErrors={imageErrors}
          handleImageError={handleImageError}
          allProjects={projects}
          filteredProjects={filteredProjects}
          onNavigateProject={setSelectedProject}
        />
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
