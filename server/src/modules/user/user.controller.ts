import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { Roles } from 'src/decorators/role.decorator';
import AuthGuard from '../auth/guards/auth.guard';
import { UserParam } from 'src/decorators/user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @UseGuards(AuthGuard)
  // @Roles('admin')
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Roles('user')
  @Get()
  async get(@UserParam() user: JwtPayload) {
    return this.userService.profile(user.id)
  }
}
