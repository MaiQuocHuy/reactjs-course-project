// Mock API service for revenue data with pagination
import { revenueByCategory } from '../data/revenuesMockData';

export interface CategoryRevenueItem {
  id: string;
  category: string;
  revenue: number;
  displayRevenue: string;
  originalCategory: string;
}

export interface PaginatedCategoryRevenue {
  data: CategoryRevenueItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CategoryRevenueFilters {
  page?: number;
  limit?: number;
  sortBy?: 'revenue' | 'category';
  sortOrder?: 'asc' | 'desc';
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export class MockRevenueApiService {
  private static allCategoryData: CategoryRevenueItem[] = Object.entries(revenueByCategory)
    .map(([category, revenue], index) => ({
      id: `category-${index + 1}`,
      category: category.replace(' ', '\n'),
      originalCategory: category,
      revenue,
      displayRevenue: `$${(revenue / 1000).toFixed(0)}k`,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  static async getCategoryRevenue(
    filters: CategoryRevenueFilters = {}
  ): Promise<PaginatedCategoryRevenue> {
    // Simulate API delay
    await delay(500);

    const {
      page = 1,
      limit = 8,
      sortBy = 'revenue',
      sortOrder = 'desc'
    } = filters;

    // Sort data
    let sortedData = [...this.allCategoryData];
    if (sortBy === 'category') {
      sortedData.sort((a, b) => {
        const comparison = a.originalCategory.localeCompare(b.originalCategory);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else {
      sortedData.sort((a, b) => {
        const comparison = a.revenue - b.revenue;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    // Calculate pagination
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  static async getCategoryRevenueStats() {
    await delay(200);
    
    const totalRevenue = Object.values(revenueByCategory).reduce((sum, revenue) => sum + revenue, 0);
    const categoriesCount = Object.keys(revenueByCategory).length;
    const averageRevenue = totalRevenue / categoriesCount;
    
    return {
      totalRevenue,
      categoriesCount,
      averageRevenue,
      topCategory: this.allCategoryData[0],
      lowestCategory: this.allCategoryData[this.allCategoryData.length - 1],
    };
  }
}