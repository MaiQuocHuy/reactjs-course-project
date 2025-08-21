import { Check, X, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FilePreview } from "./FilePreview";
import { ApplicationDetailSkeleton } from "./ApplicationDetailSkeleton";

type FileItem = {
  type: "image" | "pdf" | "docx";
  url: string;
  name: string;
};

export type Application = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  certificate: FileItem;
  cv: FileItem;
  portfolio: string;
  supportingDocs: FileItem[];
};

interface ApplicationDetailProps {
  application: Application;
  onBackToList: () => void;
  isLoading?: boolean;
}

export function ApplicationDetail({
  application,
  onBackToList,
  isLoading = false,
}: ApplicationDetailProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const handleApprove = () => {
    console.log("Approved application:", application.id);
    // In real implementation, make API call
  };

  const handleReject = () => {
    console.log("Rejected application:", application.id);
    // In real implementation, make API call
  };

  if (isLoading) {
    return <ApplicationDetailSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToList}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{application.name}</CardTitle>
                <p className="text-muted-foreground">{application.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={getStatusBadge(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700 text-white w-24 h-10"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-24 h-10">
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this application from {application.name}?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReject}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject Application
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Section - moved to top */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Portfolio Link</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Portfolio Website</p>
                <p className="text-xs text-muted-foreground">{application.portfolio}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={application.portfolio} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Visit</span>
              </a>
            </Button>
          </div>
        </div>

        {/* CV Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CV</h3>
          <FilePreview file={application.cv} />
        </div>

        {/* Certificate Section - removed (s) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Certificate</h3>
          <FilePreview file={application.certificate} />
        </div>

        {/* Supporting Documents Section - moved to last */}
        {application.supportingDocs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Supporting Document
            </h3>
            <div className="space-y-3">
              {application.supportingDocs.map((doc, index) => (
                <FilePreview key={index} file={doc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
