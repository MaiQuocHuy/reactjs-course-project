import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

type Application = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
};

interface ApplicationTableRowProps {
  application: Application;
  onViewDetail: (applicationId: string) => void;
}

export function ApplicationTableRow({ application, onViewDetail }: ApplicationTableRowProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{application.name}</TableCell>
      <TableCell>{application.email}</TableCell>
      <TableCell>
        <Badge className={getStatusBadge(application.status)}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>{new Date(application.submittedDate).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(application.id)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Detail
        </Button>
      </TableCell>
    </TableRow>
  );
}
