import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Globe, Award, Paperclip, X, Check, ArrowLeft } from "lucide-react";
import {
  useGetApplicationsByUserIdQuery,
  useReviewApplicationMutation,
} from "@/services/applicationsApi";
import { ApplicationDetailSkeleton } from "./ApplicationDetailSkeleton";
import { FileDisplay } from "./FileDisplay";
import { getStatusVariant } from "../ApplicationsList/ApplicationsList";

export const ApplicationDetail = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // If no userId is found in params, redirect back to applications list
  if (!userId) {
    navigate("/admin/applications");
    return null;
  }

  const { data: applications, isLoading, error } = useGetApplicationsByUserIdQuery(userId);
  const [reviewApplication, { isLoading: isReviewing }] = useReviewApplicationMutation();

  // Get the application index from URL parameters, defaulting to 1 (user-facing)
  const getSelectedIndexFromUrl = (): number => {
    const indexParam = searchParams.get("applicationIndex");
    if (indexParam) {
      const index = parseInt(indexParam, 10);
      if (!isNaN(index) && index >= 1) {
        return index - 1;
      }
    }
    return 0;
  };

  // Initialize selected application index from URL
  const [selectedApplicationIndex, setSelectedApplicationIndex] = useState(getSelectedIndexFromUrl);

  // Update URL when applications data is loaded and validate the index
  useEffect(() => {
    if (applications && applications.length > 0) {
      const urlIndex = getSelectedIndexFromUrl();
      const validIndex = Math.min(urlIndex, applications.length - 1);

      // Always update the URL to show the user-facing index (1-based)
      updateUrlWithIndex(validIndex);
      setSelectedApplicationIndex(validIndex);
    }
  }, [applications]);

  // Function to update URL with new application index
  const updateUrlWithIndex = (index: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    // Convert from 0-based internal index to 1-based user-facing index
    const userFacingIndex = index + 1;
    newSearchParams.set("applicationIndex", userFacingIndex.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  // Function to change selected application and update URL
  const changeSelectedApplication = (newIndex: number) => {
    if (applications && newIndex >= 0 && newIndex < applications.length) {
      setSelectedApplicationIndex(newIndex);
      updateUrlWithIndex(newIndex);
    }
  };

  // Get the selected application or the first one
  const application = applications?.[selectedApplicationIndex] || applications?.[0];
  const hasMultipleApplications = applications && applications.length > 1;

  // Parse documents if they exist
  const documents = application?.documents
    ? typeof application.documents === "string"
      ? (() => {
          try {
            return JSON.parse(application.documents);
          } catch {
            return null;
          }
        })()
      : application.documents
    : null;

  // Format the submitted date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Handle approve application
  const handleApprove = async () => {
    if (!application) return;

    try {
      await reviewApplication({
        id: application.id,
        action: "APPROVED",
      }).unwrap();

      setShowApproveModal(false);
      navigate("/admin/applications");
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  // Handle reject application
  const handleReject = async () => {
    if (!rejectionReason.trim() || !application) {
      return;
    }

    try {
      await reviewApplication({
        id: application.id,
        action: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      }).unwrap();

      setShowRejectModal(false);
      setRejectionReason("");
      navigate("/admin/applications");
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  // Check if application is already reviewed
  const isAlreadyReviewed = application?.status !== "PENDING";

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <ApplicationDetailSkeleton />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading application</div>
          <div className="text-gray-500 mb-4">Please try again later</div>
          <Button onClick={() => navigate("/admin/applications")} variant="outline">
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          onClick={() => navigate("/admin/applications")}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {/* Application Selector for Multiple Applications */}
        {hasMultipleApplications && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Applications for this user ({applications.length} total)
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    changeSelectedApplication(Math.max(0, selectedApplicationIndex - 1))
                  }
                  variant="outline"
                  size="sm"
                  disabled={selectedApplicationIndex === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedApplicationIndex + 1} of {applications.length}
                </span>
                <Button
                  onClick={() =>
                    changeSelectedApplication(
                      Math.min(applications.length - 1, selectedApplicationIndex + 1)
                    )
                  }
                  variant="outline"
                  size="sm"
                  disabled={selectedApplicationIndex === applications.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.applicant.name}</h1>
            <p className="text-gray-600">{application.applicant.email}</p>
            {hasMultipleApplications && (
              <p className="text-sm text-gray-500 mt-1">Application ID: {application.id}</p>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-4">
              <Badge className={`text-sm capitalize ${getStatusVariant(application.status)}`}>
                {application.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Submitted: {formatDate(application.submittedAt)}
              </span>
            </div>
            {/* Show rejection reason if application was rejected */}
            {application.status === "REJECTED" && application.rejectionReason && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md">
                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-700">{application.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Section - Unified Display */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Documents</h2>

        {documents ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Portfolio
              </h3>
              {documents.portfolio ? (
                <FileDisplay file={documents.portfolio} label="Portfolio" />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No portfolio provided</p>
                </div>
              )}
            </div>

            {/* CV */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CV
              </h3>
              {documents.cv ? (
                <FileDisplay file={documents.cv} label="Curriculum Vitae" />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No CV uploaded</p>
                </div>
              )}
            </div>

            {/* Certificate */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificate
              </h3>
              {documents.certificate ? (
                <FileDisplay file={documents.certificate} label="Certificate" />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No certificate uploaded</p>
                </div>
              )}
            </div>

            {/* Other Documents */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Other Documents
              </h3>
              {documents.other ? (
                <FileDisplay file={documents.other} label="Other Document" />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No other documents uploaded</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No documents available for this application</p>
          </div>
        )}
      </div>

      {/* Action Buttons - Only show if status is PENDING */}
      {!isAlreadyReviewed && (
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setShowRejectModal(true)}
            variant="destructive"
            className="flex items-center gap-2 h-10 px-6"
            disabled={isReviewing}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => setShowApproveModal(true)}
            className="flex items-center gap-2 h-10 px-6 bg-green-600 hover:bg-green-700"
            disabled={isReviewing}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this application? This will grant the applicant
              instructor access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              disabled={isReviewing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={isReviewing}
            >
              {isReviewing ? "Approving..." : "Approve Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will help the applicant
              understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700">
                Rejection Reason *
              </label>
              <Textarea
                id="rejectionReason"
                placeholder="Please explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 min-h-[100px]"
                required
              />
              {rejectionReason.trim() === "" && (
                <p className="text-sm text-red-600 mt-1">Rejection reason is required</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              disabled={isReviewing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isReviewing || !rejectionReason.trim()}
            >
              {isReviewing ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
