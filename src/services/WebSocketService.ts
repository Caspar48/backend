import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { LocationTrackingService } from './LocationTrackingService';

export class WebSocketService {
  private io: Server;
  private locationService: LocationTrackingService;

  constructor(server: HttpServer, locationService: LocationTrackingService) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    this.locationService = locationService;
    this.initialize();
  }

  private initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      // Handle driver location updates
      socket.on('updateLocation', async (data: { 
        driverId: string, 
        lat: number, 
        lng: number 
      }) => {
        try {
          await this.locationService.updateDriverLocation(data.driverId, {
            lat: data.lat,
            lng: data.lng,
            timestamp: Date.now()
          });

          // Broadcast location update to relevant clients
          this.io.emit(`driver:${data.driverId}:location`, {
            lat: data.lat,
            lng: data.lng
          });
        } catch (error) {
          console.error('Error updating location:', error);
        }
      });

      // Handle client subscribing to driver locations
      socket.on('subscribeToDriver', (driverId: string) => {
        socket.join(`driver:${driverId}`);
      });

      // Handle client unsubscribing from driver locations
      socket.on('unsubscribeFromDriver', (driverId: string) => {
        socket.leave(`driver:${driverId}`);
      });

      // Handle nearby drivers requests
      socket.on('getNearbyDrivers', async (data: {
        lat: number,
        lng: number,
        radius: number
      }) => {
        try {
          const nearbyDrivers = await this.locationService.getNearbyDrivers(
            data.lat,
            data.lng,
            data.radius
          );
          socket.emit('nearbyDrivers', nearbyDrivers);
        } catch (error) {
          console.error('Error getting nearby drivers:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Method to broadcast messages to specific rooms or all clients
  public broadcast(event: string, data: any, room?: string): void {
    if (room) {
      this.io.to(room).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }
}