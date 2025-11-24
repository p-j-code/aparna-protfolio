"use client";

import dynamic from "next/dynamic";

// Dynamic imports with ssr: false should be in client components
const ProjectsPageClient = dynamic(
  () => import("@/components/ProjectsPageClient"),
  {
    ssr: false,
  }
);

export default function ClientProjectsWrapper({
  initialData,
  viewOnly = false,
  requireAuth = false,
}) {
  return (
    <ProjectsPageClient
      initialData={initialData}
      viewOnly={viewOnly}
      requireAuth={requireAuth}
    />
  );
}
