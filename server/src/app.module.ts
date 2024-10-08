import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserRecognitionModule } from './modules/user-recognition/user-recognition.module';
import { RoomModule } from './modules/room/room.module';
import { CourseModule } from './modules/course/course.module';
import { UserAttendentModule } from './modules/user-attendent/user-attendent.module';
import { VerifyRequestModule } from './modules/verify-request/verify-request.module';
import { DeviceModule } from './modules/device/device.module';
import { AttendModule } from './modules/attend/attend.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EmailModule } from './email/email.module';
// Remove the import statement for Notification
const dbUrl = 'mongodb+srv://attendentkit:Hu6dTvtaWKWI3vZr@cluster0.1xbi6hm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

@Module({
  imports: [
    MongooseModule.forRoot(dbUrl),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    UserRecognitionModule,
    RoomModule,
    CourseModule,
    UserAttendentModule,
    VerifyRequestModule,
    DeviceModule,
    AttendModule,
    NotificationModule,
    EmailModule,
  ],
  providers: [AppService],
})

export class AppModule { }
