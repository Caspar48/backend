export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FilterQuery {
  [key: string]: any;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  search?: string;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}