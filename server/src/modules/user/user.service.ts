import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SafeUser, User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRecognitionService } from '../user-recognition/user-recognition.service';
import { CourseService } from '../course/course.service';
import { hashPassword } from 'src/helpers/user.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userRecognitionService: UserRecognitionService,
    private courseService: CourseService,
  ) { }

  // async findOneByEmail(email: string): Promise<User | undefined> {
  //   return this.userModel.findOne({ email }).exec();
  // }
  async findOneByStudentId(studentId: string): Promise<User | undefined> {
    return this.userModel.findOne({ studentId: studentId.toLowerCase() }).exec();
  }

  async findOneByPhone(phone: string): Promise<User | undefined> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user?.toObject();
  }

  async profile(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('User is invalid!');
    }
    const userRecognition = (
      await this.userRecognitionService.findOneByUserId(id)
    )?.toObject();
    const { password, ...secureUser } = user;
    return {
      ...secureUser,
    };
  }

  async addDeviceId(userId: string, deviceIds: string) {
    //update user deviceIds
    const newData = await this.userModel.findByIdAndUpdate(
      userId,
      { deviceIds: deviceIds },
      { new: true },
    ).exec();
    return newData;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Create a new user object with the hashed password
    const user = new this.userModel({
      ...createUserDto,
      studentId: createUserDto.studentId.toLowerCase(),
      tagId: createUserDto.tagId.toLowerCase(),
      password: hashPassword(createUserDto.password.trim()),
      // deviceIds: [],
    });
    console.log(user)
    try {
      await user.save();
      await this.userRecognitionService.createUserRecognition(
        user._id.toString(),
      );
    } catch (e) {

    }
    return user;
  }

  async createBatch(createUserDtos: CreateUserDto[]) {
    const defaultPassword = await hashPassword('123456')
    
    const users = createUserDtos.map(createUserDto => ({
      ...createUserDto,
      studentId: createUserDto.studentId.toLowerCase(),
      tagId: createUserDto.tagId.toLowerCase(),
      password: defaultPassword,
    }))

    try {
      console.log("====================================")
      const existingUsers = await this.userModel.find({ studentId: { $in: users.map(user => user.studentId) } }).exec();
      console.log("====================================")
      // Filter out existing users from the incoming batch
      const existingStudentIds = new Set(existingUsers.map(user => user.studentId));
      console.log("====================================")
      const newUsers = users.filter(user => !existingStudentIds.has(user.studentId));

      console.log("====================================")
      if (newUsers.length === 0) {
        throw new ConflictException('All users already exist');
      }
      console.log("====================================")
      await this.userModel.insertMany(newUsers);
    } catch (e) {
      return e;
    }

    return users;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async getStudentTimetable(userId: string) {
    const user = await this.findById(userId);

    if (!user) {
      throw new BadRequestException('User is invalid!');
    }
    // const courses = this.courseService.getByStudentId(userId);

    // return courses;
    return []
  }

  async getLecturerTimetable(userId: string) {
    const user = await this.findById(userId);

    if (!user) {
      throw new BadRequestException('User is invalid!');
    }
    const courses = this.courseService.getByLecturerId(userId);

    return courses;
  }

  async hasFaceInput(id: string) {
    const newData = await this.userModel.findByIdAndUpdate(
      id,
      { hasFaceInput: true },
      { new: true }
    );
    return { ...newData };
  }
  async setToken(id: string, token: string) {
    const newData = await this.userModel.findByIdAndUpdate(
      id,
      { token },
      { new: true }
    );
    return { ...newData };
  }
}