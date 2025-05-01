import { UserDocument } from '../types/models';
import logger from '../utils/logger';

// 通知類型接口
interface NotificationOptions {
  type: 'email' | 'sms' | 'inapp';
  subject?: string;
  template?: string;
  data?: Record<string, any>;
}

// 通知模板類型定義
type NotificationTemplate = (data: Record<string, any>) => string;

export class NotificationService {
  private templates: Map<string, NotificationTemplate>;

  constructor() {
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates() {
    this.templates.set('booking_created', (data) => `
      您的預訂已成功創建！
      預訂詳情：
      - 預訂編號：${data.bookingId}
      - 接送時間：${data.startDate}
      - 上車地點：${data.pickupLocation}
      - 下車地點：${data.dropoffLocation}
    `);

    this.templates.set('booking_confirmed', (data) => `
      您的預訂已確認！
      司機資訊：
      - 姓名：${data.driverName}
      - 車牌號：${data.licensePlate}
      - 聯絡電話：${data.driverPhone}
    `);

    this.templates.set('booking_cancelled', (data) => `
      您的預訂已取消。
      取消原因：${data.reason}
      如有任何疑問，請聯繫我們的客服。
    `);
  }

  async sendNotification(
    user: UserDocument,
    options: NotificationOptions
  ): Promise<void> {
    try {
      const { type, subject, template, data } = options;
      const templateFn = this.templates.get(template || '');
      
      if (!templateFn) {
        throw new Error(`Template ${template} not found`);
      }

      const content = templateFn(data || {});

      switch (type) {
        case 'email':
          await this.sendEmail(user.email, subject || '', content);
          break;
        case 'sms':
          await this.sendSMS(user.phone || '', content);
          break;
        case 'inapp':
          await this.sendInAppNotification(user.id, content);
          break;
        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }

      logger.info(`通知已發送 - 類型: ${type}, 用戶: ${user.email}`);
    } catch (error) {
      logger.error('發送通知失敗:', error);
      throw error;
    }
  }

  private async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // 實現電子郵件發送邏輯
    logger.info(`發送郵件到 ${to}: ${subject}`);
  }

  private async sendSMS(phone: string, content: string): Promise<void> {
    // 實現簡訊發送邏輯
    logger.info(`發送簡訊到 ${phone}`);
  }

  private async sendInAppNotification(userId: string, content: string): Promise<void> {
    // 實現應用內通知邏輯
    logger.info(`發送應用內通知給用戶 ${userId}`);
  }

  // 公共便捷方法
  async sendBookingConfirmation(booking: any): Promise<void> {
    await this.sendNotification(booking.user, {
      type: 'email',
      subject: '預訂確認通知',
      template: 'booking_confirmed',
      data: {
        driverName: booking.driver.name,
        licensePlate: booking.driver.licensePlate,
        driverPhone: booking.driver.phone,
        bookingDetails: booking
      }
    });
  }

  async sendBookingCancellation(booking: any, reason: string): Promise<void> {
    await this.sendNotification(booking.user, {
      type: 'email',
      subject: '預訂取消通知',
      template: 'booking_cancelled',
      data: {
        reason,
        bookingDetails: booking
      }
    });
  }
}