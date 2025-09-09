import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Award,
  Download,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetCertificateByIdQuery } from "@/services/certificatesApi";
import type { Certificate } from "@/types/certificates";
import { toast } from "sonner";

interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  isInstructorView?: boolean;
}

export function CertificateDetailModal({
  isOpen,
  onClose,
  certificate,
  isInstructorView = false,
}: CertificateDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const {
    data: certificateDetail,
    isLoading,
    error,
    refetch,
  } = useGetCertificateByIdQuery(certificate?.id || "", { skip: !certificate?.id || !isOpen });

  // Refetch when modal opens with new certificate
  useEffect(() => {
    if (isOpen && certificate?.id) {
      refetch();
    }
  }, [isOpen, certificate?.id, refetch]);

  const handleCopyCode = async () => {
    if (certificate?.certificateCode) {
      try {
        await navigator.clipboard.writeText(certificate.certificateCode);
        setCopied(true);
        toast.success("Certificate code copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy certificate code");
      }
    }
  };

  // Helper function to get view URL (without fl_attachment)
  const getViewUrl = (fileUrl: string) => {
    return fileUrl.replace("/fl_attachment", "");
  };

  // Helper function to get download URL (with fl_attachment)
  const getDownloadUrl = (fileUrl: string) => {
    if (fileUrl.includes("/fl_attachment")) {
      return fileUrl;
    }
    return fileUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  const handleViewCertificate = () => {
    const fileUrl = certificateDetail?.fileUrl;
    if (fileUrl) {
      const viewUrl = getViewUrl(fileUrl);
      window.open(viewUrl, "_blank");
      toast.success("Opening certificate in new tab");
    } else {
      toast.error("Certificate file not available for viewing");
    }
  };

  const handleDownload = () => {
    const fileUrl = certificateDetail?.fileUrl;
    if (fileUrl) {
      const downloadUrl = getDownloadUrl(fileUrl);
      window.open(downloadUrl, "_blank");
      toast.success("Certificate download started");
    } else {
      toast.error("Certificate file not available for download");
    }
  };

  const getStatusBadge = (status: Certificate["fileStatus"]) => {
    switch (status) {
      case "GENERATED":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Generated
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No date";
    try {
      return format(new Date(dateString), "EEEE, MMMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  if (!certificate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[60vw] w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Certificate Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Loading certificate details...
            </div>

            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load certificate details. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Action Buttons at the top */}
            <div className="flex flex-wrap gap-3 pt-2 border-b pb-4">
              {certificate.fileStatus === "GENERATED" && certificateDetail?.fileUrl && (
                <Button onClick={handleViewCertificate} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Certificate
                </Button>
              )}

              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex items-center gap-2"
                disabled={certificate.fileStatus !== "GENERATED" || !certificateDetail?.fileUrl}
                title={
                  certificate.fileStatus === "PENDING"
                    ? "Certificate is still being generated"
                    : "Download certificate"
                }
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            </div>

            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {certificate.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(certificate.fileStatus)}
                  </div>
                </div>
                <Award className="h-12 w-12 text-blue-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Issued:</span>
                  <span className="font-medium">{formatDate(certificate.issuedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium">
                    {certificateDetail?.instructorName || certificate.instructorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Certificate Code</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                <code className="flex-1 font-mono text-sm">{certificate.certificateCode}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isInstructorView ? "Student Name" : "Recipient Name"}
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{certificateDetail?.userName || certificate.userName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{certificateDetail?.userEmail || certificate.userEmail}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Title</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span>{certificateDetail?.courseTitle || certificate.courseTitle}</span>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
              <p>
                <strong>{isInstructorView ? "Note:" : "Tip:"}</strong>{" "}
                {isInstructorView
                  ? "This certificate was issued to a student who successfully completed your course. You can share the certificate code or public link with others for verification."
                  : "You can share your certificate by copying the certificate code and sending it to others, or by sharing the public certificate page link."}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
