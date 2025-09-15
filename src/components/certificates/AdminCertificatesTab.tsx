import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/hooks/useCertificates";
import { FilterBar } from "@/components/certificates/FilterBar";
import { CertificatesTable } from "@/components/certificates/CertificatesTable";
import { CertificateDetailModal } from "@/components/certificates/CertificateDetailModal";
import { Pagination } from "@/components/shared/Pagination";
import type { CertificateFilters, Certificate } from "@/types/certificates";

export default function AdminCertificatesTab() {
  const [filters, setFilters] = useState<CertificateFilters>({
    mode: "all",
    search: "",
    selectedCourseId: "",
    selectedUserId: "",
    page: 0,
    size: 10,
  });

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { certificates, isLoading, error, pagination, refetch } = useCertificates({ filters });

  const handleFilterChange = (updates: Partial<CertificateFilters>) => {
    setFilters((prev) => {
      // Reset page when mode or search changes
      const shouldResetPage = "mode" in updates || "search" in updates;
      return {
        ...prev,
        ...updates,
        page: shouldResetPage ? 0 : prev.page,
      };
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  };

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground">
            Manage and view all course completion certificates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Certificates
            {pagination && (
              <span className="text-sm font-normal text-muted-foreground">
                {pagination.totalElements} total certificates
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load certificates. Please try again.</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No certificates found</h3>
                <p>
                  {filters.mode === "all" && filters.search
                    ? `No certificates match "${filters.search}"`
                    : filters.mode === "course" && filters.selectedCourseId
                    ? "No certificates found for the selected course"
                    : filters.mode === "user" && filters.selectedUserId
                    ? "No certificates found for the selected user"
                    : "No certificates available"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <CertificatesTable
                certificates={certificates}
                onCertificateClick={handleCertificateClick}
                isLoading={isLoading}
              />

              {pagination && (
                <div className="mt-6">
                  <Pagination
                    currentPage={filters.page}
                    itemsPerPage={filters.size}
                    pageInfo={pagination}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CertificateDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        certificate={selectedCertificate}
      />
    </div>
  );
}
