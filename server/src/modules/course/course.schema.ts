import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber } from 'class-validator';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Room } from '../room/room.schema';


@Schema({ collection: 'course' })
class CoursetDocument extends Document {

  @Prop({ required: true })
  @IsNumber()
  courseId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  @IsNumber()
  day: number;

  @Prop({ required: true })
  @IsNumber()
  lessonFrom: number;

  @Prop({ required: true })
  @IsNumber()
  lessonTo: number;
  

  @Prop()
  @IsNumber()
  startTime: number;

  @Prop()
  @IsNumber()
  endTime: number;

  @Prop()
  @IsNumber()
  dayInWeek: number;

  @Prop({  type: Types.ObjectId, ref: 'Room' })
  room: Room | Types.ObjectId;

  // @Prop([{ type: Types.ObjectId, ref: 'User' }])
  // students: (User | Types.ObjectId)[];

  @Prop({ type: [String] })
  studentIds: string[];

  // @Prop([{ type: String, ref: 'User', localField: 'students', foreignField: 'studentId' }])
  // students: string[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  lecturers: (User | Types.ObjectId)[];
}


export class Course extends CoursetDocument {
  _id: Types.ObjectId;
}

const CourseSchema = SchemaFactory.createForClass(CoursetDocument);

CourseSchema.index({ courseId: 1})

export default CourseSchema
