export interface ApiResponse<T> {
	status: string;
	message: string;
	data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: Page;
}

export interface Page {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}