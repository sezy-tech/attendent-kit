import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserAttendentService } from './user-attendent.service';
import { CheckUserAttendantDto, CreateUserAttendantDto, RequestUserAttendantDto } from './dto/create-user-attendent.dto';
import AuthGuard from '../auth/guards/auth.guard';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UserParam } from 'src/decorators/user.decorator';

@Controller('user-attendance')
export class UserAttendentController {
  constructor(private readonly userAttendentService: UserAttendentService) { }

  @Post('/request')
  async request(@Body() requestUserAttendantDto: RequestUserAttendantDto): Promise<Boolean> {
    this.userAttendentService.request(requestUserAttendantDto);
    return true
  }

  @Post('/check')
  async check(@Body() checkUserAttendantDto: CheckUserAttendantDto){
    return this.userAttendentService.check(checkUserAttendantDto);
  }

  @Post()
  async create(@Body() createUserAttendantDto: CreateUserAttendantDto){
    return this.userAttendentService.create(createUserAttendantDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getByUserId(@UserParam() user: JwtPayload){
    return this.userAttendentService.getByUserId(user.id);
  }
}
