import { FileText, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Certificate } from "@/types/certificates";

interface CertificatesTableProps {
  certificates: Certificate[];
  onCertificateClick: (certificate: Certificate) => void;
  isLoading?: boolean;
}

export function CertificatesTable({
  certificates,
  onCertificateClick,
  isLoading = false,
}: CertificatesTableProps) {
  const getStatusBadge = (status: Certificate["fileStatus"]) => {
    switch (status) {
      case "GENERATED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Generated
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate, index) => (
            <TableRow
              key={certificate.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onCertificateClick(certificate)}
            >
              <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{certificate.userName || "Unknown Student"}</div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.userEmail || "No email"}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="max-w-[200px]">
                  <div
                    className="font-medium truncate"
                    title={certificate.courseTitle || "Unknown Course"}
                  >
                    {certificate.courseTitle || "Unknown Course"}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">{certificate.instructorName || "Unknown Instructor"}</div>
              </TableCell>

              <TableCell>{getStatusBadge(certificate.fileStatus)}</TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCertificateClick(certificate);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
