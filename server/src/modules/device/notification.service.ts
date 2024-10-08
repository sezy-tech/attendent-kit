// import { Injectable } from '@nestjs/common';
// // import { FirebaseAdminService } from './firebase-admin.service';

// @Injectable()
// export class NotificationService {
//   constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

//   async sendNotification(token: string, title: string, body: string): Promise<void> {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token,
//     };

//     try {
//       await this.firebaseAdminService.getMessaging().send(message);
//       console.log('Notification sent successfull  y');
//     } catch (error) {
//       console.error('Error sending notification:', error);
//     }
//   }
// }
