import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserRecognitionService } from './user-recognition.service';
import { AddUserFaceDto } from './dto/create-user-recognition.dto';
import { UserParam } from 'src/decorators/user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Roles } from 'src/decorators/role.decorator';
import AuthGuard from '../auth/guards/auth.guard';

@Controller('user-recognition')
export class UserRecognitionController {
  constructor(private readonly userRecognitionService: UserRecognitionService) { }

  @Post('/face/add')
  @UseGuards(AuthGuard)
  @Roles('user')
  addFaceLandMark(@Body() addUserFaceDto: AddUserFaceDto, @UserParam() user: JwtPayload) {
    return this.userRecognitionService.addFaceLandMark(user.id, addUserFaceDto.landmark);
  }
  @Post(
    '/face/verify')
  @UseGuards(AuthGuard)
  @Roles('user')
  verifyFace(@Body() addUserFaceDto: AddUserFaceDto, @UserParam() user: JwtPayload) {
    return this.userRecognitionService.verifyFace(user.id, addUserFaceDto.landmark);
  }

}
