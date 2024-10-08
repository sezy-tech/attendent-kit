// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import * as fs from 'fs';
// import * as path from 'path';
// @Injectable()
// export class FirebaseAdminService implements OnModuleInit {
//   onModuleInit() {
//     const serviceAccountPath = path.resolve(
//       process.cwd(),
//       'src/modules/device/service_account.json',
//     );

//     if (!fs.existsSync(serviceAccountPath)) {
//       throw new Error(
//         `Service account file not found at path: ${serviceAccountPath}`,
//       );
//     }

//     const serviceAccount = JSON.parse(
//       fs.readFileSync(serviceAccountPath, 'utf8'),
//     );
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//     });
//   }

//   getMessaging() {
//     return admin.messaging();
//   }
// }
