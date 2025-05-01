import { Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'user' | 'driver' | 'admin';
  phone?: string;
  name?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface BookingDocument extends Document {
  userId: string;
  driverId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  passengers: number;
  luggage: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  cancelReason?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
  duration?: number; // Virtual field
}

export interface DriverDocument extends Document {
  userId: string;
  vehicleType: string;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: {
    type: string;
    coordinates: number[];
  };
  rating?: number;
  totalTrips: number;
  createdAt: Date;
  updatedAt: Date;
}