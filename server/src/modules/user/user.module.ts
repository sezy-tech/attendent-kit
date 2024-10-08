import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema, { User } from './user.schema';
import { UserRecognitionModule } from '../user-recognition/user-recognition.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserRecognitionModule,
    CourseModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
