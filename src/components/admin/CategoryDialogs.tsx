import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Loader2, Hash, FileText, BookOpen } from "lucide-react";
import type { Category, CategoryRequest } from "@/services/categoriesApi";

// Add Category Dialog
interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryRequest) => void;
  isLoading?: boolean;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<CategoryRequest>>({});

  useEffect(() => {
    if (!open) {
      setFormData({ name: "", description: "" });
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new course category. Make sure to use a descriptive name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Web Development"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this category covers..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Category Dialog
interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit: (id: string, data: CategoryRequest) => void;
  isLoading?: boolean;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<CategoryRequest>>({});

  useEffect(() => {
    if (category && open) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
      setErrors({});
    } else if (!open) {
      setFormData({ name: "", description: "" });
      setErrors({});
    }
  }, [category, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && validateForm()) {
      onSubmit(category.id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information. Changes will affect all associated
            courses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Category Name *</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Web Development"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe what this category covers..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// View Category Dialog
interface ViewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const ViewCategoryDialog: React.FC<ViewCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
}) => {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Category Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Hash className="h-4 w-4" />
                Category ID
              </div>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
                {category.id}
              </code>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <BookOpen className="h-4 w-4" />
                Course Count
              </div>
              <Badge
                variant={category.courseCount > 0 ? "default" : "secondary"}
              >
                {category.courseCount} courses
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Name</div>
            <div className="text-lg font-semibold">{category.name}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Slug</div>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
              {category.slug}
            </code>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Description</div>
            <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
              {category.description || "No description provided"}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Category Dialog
interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading = false,
}) => {
  if (!category) return null;

  const canDelete = category.courseCount === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? "Delete Category" : "Cannot Delete Category"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Are you sure you want to delete the category "{category.name}"?
                This action cannot be undone.
              </>
            ) : (
              <>
                Cannot delete the category "{category.name}" because it has{" "}
                {category.courseCount}
                associated course{category.courseCount !== 1 ? "s" : ""}. Please
                remove all courses from this category first.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={() => onConfirm(category.id)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Category
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
