import { getPortfolioData } from "@/lib/portfolio-utils-server";
import { Suspense } from "react";
import ClientProjectsWrapper from "@/components/ClientProjectsWrapper";

export const metadata = {
  title: "Projects Admin - Aparna Munagekar",
  description: "Aparna Munagekar - Projects Editor",
};

export default async function ProjectsAdminPage() {
  // Get portfolio data
  const portfolioData = await getPortfolioData();

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientProjectsWrapper
          initialData={portfolioData}
          viewOnly={false}
          requireAuth={true}
        />
      </Suspense>
    </main>
  );
}
