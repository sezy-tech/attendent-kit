import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserRecognitionService } from './user-recognition.service';
import { AddUserFaceDto, AddUserSpeechDto, VerifyUserFaceDto, VerifyUserSpeechDto } from './dto/create-user-recognition.dto';
import { UserParam } from 'src/decorators/user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Roles } from 'src/decorators/role.decorator';
import AuthGuard from '../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-recognition')
export class UserRecognitionController {
  constructor(private readonly userRecognitionService: UserRecognitionService) { }

  // @Post('/face/add')
  // @UseGuards(AuthGuard)
  // @Roles('student')
  // addFaceLandMark(@Body() addUserFaceDto: AddUserFaceDto, @UserParam() user: JwtPayload) {
  //   return this.userRecognitionService.addFaceLandMark(user.id, addUserFaceDto.landmark);
  // }
  @Post('/face/addfaces')
  @UseGuards(AuthGuard)
  @Roles('student')
  @UseInterceptors(FileInterceptor('file'))
  async saveFace(@UserParam() user: JwtPayload, @UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
        throw new Error('File is undefined');
    }
    console.log(file);
    return this.userRecognitionService.saveFace(user.id, file);
}
  // addFaces(@Body() addUserFaceDto: AddUserFaceDto, @UserParam() user: JwtPayload) {
  //   console.log(addUserFaceDto.facePath);
  //   return this.userRecognitionService.addFaces(user.id, addUserFaceDto.facePath);
  // }
  // @Post(
  //   '/face/verify')
  // @UseGuards(AuthGuard)
  // @Roles('student')
  // verifyFace(@Body() addUserFaceDto: VerifyUserFaceDto, @UserParam() user: JwtPayload) {

  //   return 
  //   // this.userRecognitionService.verifyFace(user.id, addUserFaceDto.landmark);
  // }

  @Post(
    '/face/verify')
  @UseGuards(AuthGuard)
  @Roles('student')
  verifyFace(@Body() addUserFaceDto: VerifyUserFaceDto, @UserParam() user: JwtPayload) {
    return this.userRecognitionService.verifyFace(user.id, addUserFaceDto.facePath);
  }
    
  @Post('/speech/add')
  @UseGuards(AuthGuard)
  @Roles('student')
  addSpeechPath(@Body() addUserSpeechDto: AddUserSpeechDto, @UserParam() user: JwtPayload) {
    return this.userRecognitionService.addSpeechPath(user.id, addUserSpeechDto.path);
  }

  @Post('/speech/verify')
  @UseGuards(AuthGuard)
  @Roles('student')
  verifySpeech(@Body() addUserSpeechDto: VerifyUserSpeechDto, @UserParam() user: JwtPayload) {
    return this.userRecognitionService.verifySpeech(user.id, addUserSpeechDto.path);
  }
}
