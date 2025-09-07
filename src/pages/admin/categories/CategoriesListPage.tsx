import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { CategoryTable } from "../../../components/admin/CategoryTable";
import { SearchBar } from "../../../components/admin/SearchBar";
import {
  AddCategoryDialog,
  EditCategoryDialog,
  ViewCategoryDialog,
  DeleteCategoryDialog,
} from "../../../components/admin/CategoryDialogs";
import { FolderPlus, RefreshCw } from "lucide-react";
import {
  useGetCategoriesQuery,
  useGetAllCategoriesDropdownQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../services/categoriesApi";
import type {
  Category,
  CategoryRequest,
} from "../../../services/categoriesApi";
import { toast } from "sonner";

export const CategoriesListPage: React.FC = () => {
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortDir] = useState<"asc" | "desc">("desc");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // API hooks
  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({
    search: searchTerm,
    page: currentPage,
    size: pageSize,
    sortBy,
    sortDir,
  });

  // API hook for statistics - get all categories to calculate stats
  const { data: allCategoriesResponse } = useGetAllCategoriesDropdownQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = categoriesResponse?.data?.content || [];
  const totalPages = categoriesResponse?.data?.totalPages || 0;
  const totalElements = categoriesResponse?.data?.totalElements || 0;

  // Calculate statistics from all categories
  const allCategories = allCategoriesResponse?.data || [];
  const totalCategoriesCount = allCategories.length;
  const activeCategoriesCount = allCategories.filter(
    (c) => c.courseCount > 0
  ).length;
  const emptyCategoriesCount = allCategories.filter(
    (c) => c.courseCount === 0
  ).length;

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCategory = async (data: CategoryRequest) => {
    try {
      await createCategory(data).unwrap();
      toast.success("Category created successfully!");
      setAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to create category:", error);
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleEditCategory = async (id: string, data: CategoryRequest) => {
    try {
      await updateCategory({ id, data }).unwrap();
      toast.success("Category updated successfully!");
      setEditDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error: any) {
      console.error("Failed to update category:", error);
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Categories refreshed!");
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // More complex pagination logic for many pages
      const startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      if (startPage > 0) {
        items.push(
          <PaginationItem key={0}>
            <PaginationLink onClick={() => handlePageChange(0)}>
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 1) {
          items.push(<PaginationEllipsis key="start-ellipsis" />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
          items.push(<PaginationEllipsis key="end-ellipsis" />);
        }
        items.push(
          <PaginationItem key={totalPages - 1}>
            <PaginationLink onClick={() => handlePageChange(totalPages - 1)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Categories
              </h3>
              <p className="text-sm mb-4">
                {(error as any)?.data?.message || "Failed to load categories"}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage course categories and their organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategoriesCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeCategoriesCount} with courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Categories
            </CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCategoriesCount}</div>
            <p className="text-xs text-muted-foreground">
              Categories with courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empty Categories
            </CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emptyCategoriesCount}</div>
            <p className="text-xs text-muted-foreground">
              Categories without courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Categories List</CardTitle>
            <div className="flex gap-2">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search categories..."
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryTable
            categories={categories}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(0, currentPage - 1))
                      }
                      className={
                        currentPage === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {generatePaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(totalPages - 1, currentPage + 1)
                        )
                      }
                      className={
                        currentPage === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results info */}
          <div className="text-sm text-muted-foreground mt-4 text-center">
            Showing {categories.length} of {totalElements} categories
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddCategoryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddCategory}
        isLoading={isCreating}
      />

      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
        onSubmit={handleEditCategory}
        isLoading={isUpdating}
      />

      <ViewCategoryDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        category={selectedCategory}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleDeleteCategory}
        isLoading={isDeleting}
      />
    </div>
  );
};
