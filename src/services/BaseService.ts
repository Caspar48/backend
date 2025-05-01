import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginationOptions, PaginatedResponse } from '../types/common';
import { paginatedQuery, buildFilterQuery } from '../utils/queryUtils';
import { AppError } from '../utils/AppError';

export abstract class BaseService<T extends Document> {
  constructor(
    protected readonly model: Model<T>,
    protected readonly modelName: string
  ) {}

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc;
  }

  async findById(id: string, populateFields?: string[]): Promise<T> {
    let query = this.model.findById(id);
    
    if (populateFields?.length) {
      populateFields.forEach(field => {
        query = query.populate(field);
      });
    }
    
    const doc = await query;
    if (!doc) {
      throw new AppError(`${this.modelName} not found`, 404);
    }
    
    return doc;
  }

  async findOne(filter: FilterQuery<T>, populateFields?: string[]): Promise<T | null> {
    let query = this.model.findOne(filter);
    
    if (populateFields?.length) {
      populateFields.forEach(field => {
        query = query.populate(field);
      });
    }
    
    return query;
  }

  async findAll(
    filter: FilterQuery<T> = {},
    options: PaginationOptions,
    populateFields?: string[]
  ): Promise<PaginatedResponse<T>> {
    return paginatedQuery(this.model, filter, options, populateFields);
  }

  async update(id: string, updateData: UpdateQuery<T>): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!doc) {
      throw new AppError(`${this.modelName} not found`, 404);
    }
    
    return doc;
  }

  async delete(id: string): Promise<void> {
    const doc = await this.model.findByIdAndDelete(id);
    
    if (!doc) {
      throw new AppError(`${this.modelName} not found`, 404);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }

  buildFilter(queryParams: Record<string, any>, allowedFields: string[]): FilterQuery<T> {
    return buildFilterQuery(queryParams, allowedFields);
  }
}