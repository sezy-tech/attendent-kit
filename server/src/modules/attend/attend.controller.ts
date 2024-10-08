import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AttendService } from './attend.service';
import { CreateAttendDto } from './dto/create-attend.dto';
import { UpdateAttendDto } from './dto/update-attend.dto';
import AuthGuard from '../auth/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UserParam } from 'src/decorators/user.decorator';
@Controller('attend')
export class AttendController {
  constructor(private readonly attendService: AttendService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('student')
  create(@Body() createAttendDto: CreateAttendDto ,@UserParam() user: JwtPayload) {
    const userId = user.id;
    return this.attendService.create(userId, createAttendDto);
  }

  @Get()
  findAll() {
    return this.attendService.findAll();
  }


  @Get(':id')
  findByStudentId(@Param('id') id: string) {
    return this.attendService.findByStudentId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendDto: UpdateAttendDto) {
    return this.attendService.update(+id, updateAttendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendService.remove(+id);
  }
}
