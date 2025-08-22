import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import type { Category } from "@/services/categoriesApi";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
  isLoading?: boolean;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No categories found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={category.description}>
                  {category.description || "No description"}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell>
                <Badge
                  variant={category.courseCount > 0 ? "default" : "secondary"}
                >
                  {category.courseCount} courses
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(category)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category)}
                    title="Delete Category"
                    disabled={category.courseCount > 0}
                    className={
                      category.courseCount > 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
