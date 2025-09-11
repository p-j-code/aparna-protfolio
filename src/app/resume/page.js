import { getResumeData } from "@/lib/resume-utils";
import { Suspense } from "react";
import ClientResumeWrapper from "@/components/ClientResumeWrapper";

export const metadata = {
  title: "Resume - Aparna Munagekar",
  description: "Aparna Munagekar - Resume and Professional Experience",
};

export default async function ResumePage() {
  // Get resume data from JSON file
  const resumeData = await getResumeData();

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientResumeWrapper initialData={resumeData} />
      </Suspense>
    </main>
  );
}
