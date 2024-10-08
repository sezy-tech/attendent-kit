import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import AssignUserToCourseDto from './dto/assign-user-to-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import AuthGuard from '../auth/guards/auth.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  // @UseGuards(AuthGuard)
  // @Roles('admin')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Post(':id/student')
  addStudent(@Param('id') id: string, @Body() assignUserToCourseDto: AssignUserToCourseDto) {
    return this.courseService.addStudent(id, assignUserToCourseDto.userId);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Delete(':id/student')
  removeStudent(@Param('id') id: string, @Body() assignUserToCourseDto: AssignUserToCourseDto) {
    return this.courseService.removeStudent(id, assignUserToCourseDto.userId);
  }
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Post(':id/lecturer')
  addLecturer(@Param('id') id: string, @Body() assignUserToCourseDto: AssignUserToCourseDto) {
    return this.courseService.addLecturer(id, assignUserToCourseDto.userId);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Delete(':id/lecturer')
  removeLecturer(@Param('id') id: string, @Body() assignUserToCourseDto: AssignUserToCourseDto) {
    return this.courseService.removeLecturer(id, assignUserToCourseDto.userId);
  }
}
