import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckUserAttendantDto, CreateUserAttendantDto, CreateUserAttendentDto, RequestUserAttendantDto } from './dto/create-user-attendent.dto';
import { UpdateUserAttendentDto } from './dto/update-user-attendent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserAttendent } from './user-attendent.schema';
import { Model } from 'mongoose';
import { getCurrentWeekNumber } from 'src/helpers/datetime.helper';
import { User } from '../user/user.schema';
import { NotificationService } from '../notification/notification.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { request } from 'http';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserAttendentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserAttendent.name) private userAttendentModel: Model<UserAttendent>,
    private notificationService: NotificationService,
    private emailService: EmailService,
  ) { }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Task is running every minute');
  }
  z

  async request(requestUserAttendantDto: RequestUserAttendantDto) {
    const { courseId, tagIds } = requestUserAttendantDto;
    const users = await this.userModel.find({ tagId: { $in: tagIds.map(tagId => tagId.toLowerCase()) } });
    const userAttendents = await this.userAttendentModel.find({ courseId: courseId.toLowerCase() });
    // console.log("-----------------")
    // console.log(requestUserAttendantDto)
    // console.log(users)
    for (const user of users) {
      const { token, tagId } = user
      this.notificationService.sendNotification({
        title: 'Request Attendance',
        body: 'Please check Attendance',
        data: {
          screen: 'ChatScreen', // The screen you want to navigate to
          userId: '12345' // Additional data if needed
          , path: '/verify-face', courseId: courseId.toLowerCase()
        },
        token: token
      })
      this.emailService.send({ user })

      // if (!userAttendents.some(userAttendent => userAttendent.tagId === tagId)) {
      //   try {
      //     await this.userAttendentModel.create({ courseId: courseId.toLowerCase(), tagId: tagId.toLowerCase() });
      //   } catch (e) {
      //     console.log(e)
      //   }
      // }
    }

    return
  }
  async check({ courseId }: CheckUserAttendantDto) {
    try {
      const studentIds = (await (await this.userAttendentModel.find({ courseId: courseId.toLowerCase() }).select('studentId'))).map(data => data.studentId.toLowerCase())
      const tagIds = (await this.userModel.find({ studentId: { $in: studentIds } }).select('tagId')).map(data => data.tagId.toLowerCase());
      return tagIds
    } catch (e) {
      throw new BadRequestException('User is invalid!');
    }
  }

  async create({ courseId, studentId }: CreateUserAttendantDto) {
    try {
      await this.userAttendentModel.create({ courseId: courseId.toLowerCase(), studentId: studentId.toLowerCase() });
    } catch (e) {
      throw new BadRequestException('User is invalid!');
    }
  }
  async getByUserId(studentId: string) {
    return this.userAttendentModel.find({ studentId });
  }
}
