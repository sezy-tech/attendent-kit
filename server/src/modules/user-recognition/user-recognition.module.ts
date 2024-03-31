import { Module } from '@nestjs/common';
import { UserRecognitionService } from './user-recognition.service';
import { UserRecognitionController } from './user-recognition.controller';
import UserRecognitionSchema, { UserRecognition } from './user-recognition.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserRecognition.name, schema: UserRecognitionSchema }]),
  ],
  controllers: [UserRecognitionController],
  providers: [UserRecognitionService],
  exports: [UserRecognitionService],
})
export class UserRecognitionModule { }
