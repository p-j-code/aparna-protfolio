import { getResumeData } from "@/lib/resume-utils-server";
import { Suspense } from "react";
import ClientResumeWrapper from "@/components/ClientResumeWrapper";

export const metadata = {
  title: "Resume Admin - Aparna Munagekar",
  description: "Aparna Munagekar - Resume Editor",
};

export default async function ResumeAdminPage() {
  // Get resume data from JSON file
  const resumeData = await getResumeData();

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientResumeWrapper
          initialData={resumeData}
          viewOnly={false}
          requireAuth={true}
        />
      </Suspense>
    </main>
  );
}
