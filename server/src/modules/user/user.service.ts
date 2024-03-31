import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SafeUser, User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRecognitionService } from '../user-recognition/user-recognition.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userRecognitionService: UserRecognitionService,
  ) { }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user.toObject()
  }

  async profile(id: string): Promise<SafeUser> {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('User is invalid!');
    }
    const { password, ...secureUser } = user
    return secureUser
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userDetails } = createUserDto;

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object with the hashed password
    const user = new this.userModel({
      ...userDetails,
      password: hashedPassword,
    });
    await user.save();
    await this.userRecognitionService.createUserRecognition(user._id.toString())
    return user
  }
}
