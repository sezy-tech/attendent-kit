import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import DeviceSchema, { Device } from './device.schema';
// import { FirebaseAdminService } from './firebase-admin.service';
// import { NotificationService } from './notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
