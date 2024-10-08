import { Injectable } from '@nestjs/common';
import { CreateAttendDto } from './dto/create-attend.dto';
import { UpdateAttendDto } from './dto/update-attend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attend } from './entities/attend.entity';
import { AttendDocumentType } from './attend.schema';

@Injectable()
export class AttendService {
  constructor(
    @InjectModel('Attend') private readonly attendModel: Model<AttendDocumentType>
  ) {}
  async create(userId,createAttendDto: CreateAttendDto): Promise<AttendDocumentType> {
    const createdAttend = new this.attendModel({
      studentId: userId, 
      courseId: createAttendDto.courseId,
      timeAttend: new Date()
    });
    return createdAttend.save(); 
  }

  findAll() {
    console.log('find all attend')
    return `This action returns all attend`;
  }

// find all object that includes studentId
  findByStudentId(id: string) {
    return this.attendModel.find({studentId: id})
  }
  findOne(id: number) {
    return `This action returns a #${id} attend`;
  }

  update(id: number, updateAttendDto: UpdateAttendDto) {
    return `This action updates a #${id} attend`;
  }

  remove(id: number) {
    return `This action removes a #${id} attend`;
  }
}
