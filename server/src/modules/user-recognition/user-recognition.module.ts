import { forwardRef, Module } from '@nestjs/common';
import { UserRecognitionService } from './user-recognition.service';
import { UserRecognitionController } from './user-recognition.controller';
import UserRecognitionSchema, { UserRecognition } from './user-recognition.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { UserAttendentModule } from '../user-attendent/user-attendent.module';
import { AttendModule } from '../attend/attend.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserRecognition.name, schema: UserRecognitionSchema }]),
    MulterModule.register({}),
    UserAttendentModule,
    AttendModule,
  ],
  controllers: [UserRecognitionController],
  providers: [UserRecognitionService],
  exports: [UserRecognitionService],
})
export class UserRecognitionModule { }
