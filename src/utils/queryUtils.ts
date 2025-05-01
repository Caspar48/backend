import { FilterQuery, PaginationOptions, PaginatedResponse, SortOptions } from '../types/common';
import { Model, Document } from 'mongoose';

export async function paginatedQuery<T extends Document>(
  model: Model<T>,
  filter: FilterQuery = {},
  options: PaginationOptions,
  populateFields?: string[]
): Promise<PaginatedResponse<T>> {
  const page = Math.max(1, options.page);
  const limit = Math.max(1, Math.min(100, options.limit));
  const skip = (page - 1) * limit;

  const sortOptions: SortOptions = {};
  if (options.sort) {
    const [field, order] = options.sort.split(':');
    sortOptions[field] = order === 'desc' ? -1 : 1;
  }

  let query = model.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  if (populateFields?.length) {
    populateFields.forEach(field => {
      query = query.populate(field);
    });
  }

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter)
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export function buildFilterQuery(
  queryParams: Record<string, any>,
  allowedFields: string[]
): FilterQuery {
  const filter: FilterQuery = {};

  // 處理日期範圍
  if (queryParams.startDate) {
    filter.createdAt = { $gte: new Date(queryParams.startDate) };
  }
  if (queryParams.endDate) {
    filter.createdAt = { 
      ...filter.createdAt,
      $lte: new Date(queryParams.endDate)
    };
  }

  // 處理狀態
  if (queryParams.status) {
    filter.status = queryParams.status;
  }

  // 處理搜索
  if (queryParams.search) {
    const searchRegex = new RegExp(queryParams.search, 'i');
    filter.$or = allowedFields.map(field => ({
      [field]: searchRegex
    }));
  }

  // 處理其他過濾條件
  allowedFields.forEach(field => {
    if (queryParams[field] !== undefined) {
      filter[field] = queryParams[field];
    }
  });

  return filter;
}