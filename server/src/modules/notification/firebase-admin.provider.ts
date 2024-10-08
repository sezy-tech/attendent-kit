import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    try {
      const serviceAccountPath = path.resolve(
        process.cwd(),
        'src/modules/device/service_account.json',
      );
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, 'utf8'),
      );

      const defaultApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

      return defaultApp; // Return the initialized app directly
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw error;
    }
  },
};