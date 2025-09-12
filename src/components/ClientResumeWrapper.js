"use client";

import dynamic from "next/dynamic";

// Dynamic imports with ssr: false should be in client components
const ResumePageClient = dynamic(
  () => import("@/components/ResumePageClient"),
  {
    ssr: false,
  }
);

export default function ClientResumeWrapper({ initialData, viewOnly = false, requireAuth = false }) {
  return <ResumePageClient initialData={initialData} viewOnly={viewOnly} requireAuth={requireAuth} />;
}
