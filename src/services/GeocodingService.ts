import axios from 'axios';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface Location {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface Distance {
  value: number;  // 以米為單位
  text: string;   // 格式化的距離字符串
  duration: {     // 預估行程時間
    value: number;  // 以秒為單位
    text: string;   // 格式化的時間字符串
  };
}

export class GeocodingService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';

    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }
  }

  async geocode(address: string): Promise<Location> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/geocode/json`,
        {
          params: {
            address,
            key: this.apiKey
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new AppError(`Geocoding failed: ${response.data.status}`, 400);
      }

      const result = response.data.results[0];
      const location = this.parseGeocodingResult(result);

      logger.info(`地址已解析: ${address}`);
      return location;
    } catch (error) {
      logger.error('地理編碼失敗:', error);
      throw new AppError('地理編碼失敗', 500);
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<Location> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: this.apiKey
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new AppError(`Reverse geocoding failed: ${response.data.status}`, 400);
      }

      const result = response.data.results[0];
      const location = this.parseGeocodingResult(result);

      logger.info(`座標已解析: ${lat},${lng}`);
      return location;
    } catch (error) {
      logger.error('反向地理編碼失敗:', error);
      throw new AppError('反向地理編碼失敗', 500);
    }
  }

  async calculateDistance(
    origin: Location,
    destination: Location
  ): Promise<Distance> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/distancematrix/json`,
        {
          params: {
            origins: `${origin.lat},${origin.lng}`,
            destinations: `${destination.lat},${destination.lng}`,
            mode: 'driving',
            key: this.apiKey
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new AppError(`Distance calculation failed: ${response.data.status}`, 400);
      }

      const element = response.data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new AppError(`Route not found: ${element.status}`, 400);
      }

      logger.info(`距離已計算: ${origin.address} -> ${destination.address}`);
      
      return {
        value: element.distance.value,
        text: element.distance.text,
        duration: {
          value: element.duration.value,
          text: element.duration.text
        }
      };
    } catch (error) {
      logger.error('距離計算失敗:', error);
      throw new AppError('距離計算失敗', 500);
    }
  }

  private parseGeocodingResult(result: any): Location {
    const { lat, lng } = result.geometry.location;
    const components = result.address_components;

    const location: Location = {
      lat,
      lng,
      address: result.formatted_address
    };

    // 解析地址組件
    components.forEach((component: any) => {
      const type = component.types[0];
      switch (type) {
        case 'locality':
          location.city = component.long_name;
          break;
        case 'administrative_area_level_1':
          location.state = component.long_name;
          break;
        case 'country':
          location.country = component.long_name;
          break;
        case 'postal_code':
          location.postalCode = component.long_name;
          break;
      }
    });

    return location;
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      const location = await this.geocode(address);
      return !!location.address;
    } catch (error) {
      return false;
    }
  }

  async optimizeRoute(locations: Location[]): Promise<Location[]> {
    if (locations.length <= 2) return locations;

    try {
      const response = await axios.post(
        `${this.baseUrl}/directions/json`,
        {
          origin: locations[0],
          destination: locations[locations.length - 1],
          waypoints: locations.slice(1, -1),
          optimize: true,
          key: this.apiKey
        }
      );

      if (response.data.status !== 'OK') {
        throw new AppError(`Route optimization failed: ${response.data.status}`, 400);
      }

      const optimizedOrder = response.data.routes[0].waypoint_order;
      const optimizedLocations = [
        locations[0],
        ...optimizedOrder.map((index: number) => locations[index + 1]),
        locations[locations.length - 1]
      ];

      logger.info('路線已優化');
      return optimizedLocations;
    } catch (error) {
      logger.error('路線優化失敗:', error);
      throw new AppError('路線優化失敗', 500);
    }
  }
}