import { forwardRef, Module } from '@nestjs/common';
import { UserAttendentService } from './user-attendent.service';
import { UserAttendentController } from './user-attendent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UserAttendentSchema, { UserAttendent } from './user-attendent.schema';
import { NotificationService } from '../notification/notification.service';
import { UserModule } from '../user/user.module';
import UserSchema, { User } from '../user/user.schema';
import { firebaseAdminProvider } from '../notification/firebase-admin.provider';
import { NotificationModule } from '../notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: UserAttendent.name, schema: UserAttendentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [UserAttendentController],
  providers: [UserAttendentService, NotificationService, EmailService],
  exports: [UserAttendentService],
})
export class UserAttendentModule { }