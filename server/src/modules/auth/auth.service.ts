import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(studentId: string, password: string): Promise<User> {
    // Assuming you have a method to find the user by email
    const user = await this.userService.findOneByStudentId(studentId);
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);
    if (user && await bcrypt.compare(password, user.password)) {
      // The passwords match
      // Return the user or user-related information needed for your application
      return user;
    } else {
      // Authentication failed
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.studentId, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Assuming you're returning a JWT or some login response
    const payload: JwtPayload = {
      id: user._id.toString(),
      username: user.studentId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_AT_SECRET'),
        expiresIn: this.configService.get<number>('JWT_AT_EXPIRES_IN'),
      }),
    };
  }
}
