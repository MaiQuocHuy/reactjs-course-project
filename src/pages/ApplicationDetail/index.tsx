import { useState } from "react";
import { ApplicationDetail } from "@/components/ApplicationDetail/ApplicationDetail";

// Mock data for demonstration
const mockApplication = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  status: "pending" as const,
  submittedDate: "2024-01-15",
  certificate: {
    type: "pdf" as const,
    url: "/placeholder.pdf",
    name: "Certificate.pdf",
  },
  cv: {
    type: "pdf" as const,
    url: "/placeholder.pdf",
    name: "John_Doe_CV.pdf",
  },
  portfolio: "https://johndoe.portfolio.com",
  supportingDocs: [
    {
      type: "image" as const,
      url: "/placeholder.svg?height=400&width=600",
      name: "Supporting_Document.jpg",
    },
  ],
};

interface ApplicationDetailPageProps {
  applicationId: string;
  onBackToList: () => void;
}

export function ApplicationDetailPage({ applicationId, onBackToList }: ApplicationDetailPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ApplicationDetail
      application={mockApplication}
      isLoading={isLoading}
      onBackToList={onBackToList}
    />
  );
}
