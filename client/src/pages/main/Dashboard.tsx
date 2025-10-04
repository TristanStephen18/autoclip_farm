import type React from "react";
import { Sidebar } from "../../components/ui/sidebar";
import { DashboardTop } from "../../components/ui/dashboardtop";
import { useAuthHooks } from "../../hooks/auth";
import { JobSection } from "../../components/ui/jobssection";

export const Dashboard: React.FC = () => {
  const { isMobile, viewportChecker } = useAuthHooks();

  viewportChecker();
  return (
    <div className="flex min-h-screen">
      {!isMobile && <Sidebar />}

      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        <DashboardTop />
        <JobSection isMobile={isMobile} />
      </main>
    </div>
  );
};
