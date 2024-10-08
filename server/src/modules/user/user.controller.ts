import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { Roles } from 'src/decorators/role.decorator';
import AuthGuard from '../auth/guards/auth.guard';
import { UserParam } from 'src/decorators/user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UpdateDeviceDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @UseGuards(AuthGuard)
  // @Roles('admin')
  // @Post('/create')
  // async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(createUserDto);
  // }

  // @UseGuards(AuthGuard)
  // @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  // @UseGuards(AuthGuard)
  // @Roles('admin')
  @Post('/batch')
  async createBatch(@Body() createUserDto: CreateUserDto[]){
    return this.userService.createBatch(createUserDto);
  }


  @UseGuards(AuthGuard)
  @Get('/profile')
  async get(@UserParam() user: JwtPayload) {
    return this.userService.profile(user.id)
  }
  
  @UseGuards(AuthGuard)
  @Get('/has-face-input')
  async hasFaceInput(@UserParam() user: JwtPayload) {
    return this.userService.hasFaceInput(user.id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch('device')
  addDevice(@UserParam() user: JwtPayload, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.userService.addDeviceId(user.id, updateDeviceDto.id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }


  @UseGuards(AuthGuard)
  @Get('student/timetable')
  getStudentTimetable(@UserParam() user: JwtPayload) {
    return this.userService.getStudentTimetable(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('lecturer/timetable')
  getLecturerTimetable(@UserParam() user: JwtPayload) {
    return this.userService.getStudentTimetable(user.id);
  }

  @Patch(':id/fcmtoken')
  async token(@Param('id') id, @Body() body: {token: string}) {
    return this.userService.setToken(id, body.token);
  }
}
