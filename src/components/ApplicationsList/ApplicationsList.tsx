import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApplicationTableRow } from "./ApplicationsTableRow";
import { ApplicationCard } from "./ApplicationCard";
import { SearchFilterBar } from "./SearchFilterBar";
import { PaginationControls } from "./PaginationControls";
import { ApplicationsListSkeleton } from "./ApplicationsListSkeleton";

type Application = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
};

interface ApplicationsListProps {
  applications: Application[];
  onViewDetail: (applicationId: string) => void;
  isLoading?: boolean;
}

export function ApplicationsList({
  applications,
  onViewDetail,
  isLoading = false,
}: ApplicationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return <ApplicationsListSkeleton />;
  }

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Applications Management</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilterBar
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.map((app) => (
                  <ApplicationTableRow key={app.id} application={app} onViewDetail={onViewDetail} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} onViewDetail={onViewDetail} />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredApplications.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
