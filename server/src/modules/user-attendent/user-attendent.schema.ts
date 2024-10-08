import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user-attendent' })
class UserAttendentDocument {
  // @Prop({ required: true })
  // userId: string;

  // @Prop({ required: true })
  // weekNumber: number;

  // @Prop({ required: true, type: [String] })
  // faceCourseIds: string[]

  // @Prop({ required: true, type: [String] })
  // speechCourseIds: string[]
  @Prop({ required: true})
  courseId: string;
  
  @Prop({ required: true})
  studentId: string;

  // @Prop({default: () => Date.now() })
  // timeAttend: Date;

  @Prop({default: () => Date.now() })
  createdAt: number;
}

export class UserAttendent extends UserAttendentDocument {
  _id: Types.ObjectId;
}

const UserAttendentSchema = SchemaFactory.createForClass(UserAttendentDocument);
UserAttendentSchema.index({ courseId: 1, tagId: 1 })

export default UserAttendentSchema
