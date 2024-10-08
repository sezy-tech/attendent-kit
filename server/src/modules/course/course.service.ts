import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) { }
  create(createCourseDto: CreateCourseDto) {
    // if (createCourseDto.room) {
    //   createCourseDto.room = new Types.ObjectId(createCourseDto.room);
    // }
    // if (createCourseDto.students) {
    //   createCourseDto.students = createCourseDto.students.map(id => new Types.ObjectId(id));
    // }
    // if (createCourseDto.lecturers) {
    //   createCourseDto.lecturers = createCourseDto.lecturers.map(id => new Types.ObjectId(id));
    // }
    return this.courseModel.create(createCourseDto)
  }

  findAll() {
    return this.courseModel.find()
  }

  findOne(id: string) {
    console.log("===")
    console.log(this.courseModel.findById(id))
    return this.courseModel.findById(id)
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    // if (updateCourseDto.room) {
    //   updateCourseDto.room = new Types.ObjectId(updateCourseDto.room);
    // }
    // if (updateCourseDto.students) {
    //   updateCourseDto.students = updateCourseDto.students.map(id => new Types.ObjectId(id));
    // }
    // if (updateCourseDto.lecturers) {
    //   updateCourseDto.lecturers = updateCourseDto.lecturers.map(id => new Types.ObjectId(id));
    // }
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto)
  }

  remove(id: string) {
    return this.courseModel.findByIdAndDelete(id)
  }

  async addStudent(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId)
    if (!course) {
      throw new Error();
    }
    // course.students.push(new Types.ObjectId(userId))
    return course.save();
  }

  async removeStudent(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId)
    if (!course) {
      throw new Error();
    }
    const userObjectId = new Types.ObjectId(userId)
    // course.students = course.students.filter(user => user._id != userObjectId)
    return course.save();
  }

  async addLecturer(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId)
    if (!course) {
      throw new Error();
    }
    course.lecturers.push(new Types.ObjectId(userId))
    return course.save();
  }

  async removeLecturer(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId)
    if (!course) {
      throw new Error();
    }
    const userObjectId = new Types.ObjectId(userId)
    course.lecturers = course.lecturers.filter(user => user._id != userObjectId)
    return course.save();
  }


  // async getByStudentId(userId: string) {
  //   const userObjectId = new Types.ObjectId(userId)
  //   const courses = this.courseModel.find({
  //     students: { $in: [userObjectId] }
  //   }).exec();

  //   return courses
  // }

  async getByLecturerId(userId: string) {
    const userObjectId = new Types.ObjectId(userId)
    const courses = this.courseModel.find({
      lecturers: { $in: [userObjectId] }
    }).exec();
    return courses
  }
}
