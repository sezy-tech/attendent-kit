import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDTO } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendNotification(
    sendNotificationDTO : SendNotificationDTO
  ): Promise<void> {
    console.log('Sending notification', sendNotificationDTO.title, sendNotificationDTO.body, sendNotificationDTO.token);
    const message = {
      notification: {
        title: 'AAS',
        body: sendNotificationDTO.body,
      },
      data: sendNotificationDTO.data,
      token: sendNotificationDTO.token,
    };
    try {
      await this.firebaseAdmin.messaging().send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
