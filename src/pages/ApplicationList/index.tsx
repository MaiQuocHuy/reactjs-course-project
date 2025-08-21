import { useState } from "react";
import { ApplicationsList } from "@/components/ApplicationsList/ApplicationsList";
import { mockApplications } from "@/App";

interface ApplicationsListPageProps {
  onViewDetail: (applicationId: string) => void;
}

export function ApplicationsListPage({ onViewDetail }: ApplicationsListPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ApplicationsList
      applications={mockApplications}
      onViewDetail={onViewDetail}
      isLoading={isLoading}
    />
  );
}
