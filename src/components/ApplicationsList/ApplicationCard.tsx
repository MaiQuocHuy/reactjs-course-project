import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Application = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
};

interface ApplicationCardProps {
  application: Application;
  onViewDetail: (applicationId: string) => void;
}

export function ApplicationCard({ application, onViewDetail }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{application.name}</h3>
            <p className="text-sm text-muted-foreground">{application.email}</p>
          </div>
          <Badge className={getStatusBadge(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {new Date(application.submittedDate).toLocaleDateString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(application.id)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
