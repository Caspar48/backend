export interface CreateBookingDto {
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: number;
  luggage: number;
  driverId: string;
  notes?: string;
}

export interface UpdateBookingDto {
  startDate?: Date;
  endDate?: Date;
  pickupLocation?: string;
  dropoffLocation?: string;
  passengers?: number;
  luggage?: number;
  notes?: string;
}

export interface UpdateBookingStatusDto {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  cancelReason?: string;
}

export interface BookingQueryDto {
  status?: string;
  startDate?: string;
  endDate?: string;
  driverId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface BookingRatingDto {
  rating: number;
  review?: string;
}