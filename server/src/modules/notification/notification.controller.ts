import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('sendPush')
  async sendPushNotification(@Body() sendNotificationDTO: SendNotificationDTO) {
    return this.notificationService.sendNotification(sendNotificationDTO);
  }
}